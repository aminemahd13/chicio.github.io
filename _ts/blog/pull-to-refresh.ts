import { sendMessageToServiceWorker } from '../common/service-worker'
import { addCssClass, removeCssClass } from '../common/css-class'
import { isServiceWorkerSupported } from '../common/service-worker'

interface PullToRefreshRepository {
  refreshStarted: boolean;
  refreshCompleted: boolean;
  startRefresh(): void;
  completeRefresh(): void;
}

interface Point {
  x: number;
  y: number;
}

const areAllAvailable = (
  pullToRefreshElement: HTMLElement | null, 
  pullToRefreshStatusElement: HTMLElement | null, 
  pullToRefreshLoaderElement: HTMLElement | null, 
  pullableContent: HTMLElement | null
): boolean => (
  pullToRefreshElement != null || 
  pullToRefreshStatusElement != null || 
  pullToRefreshLoaderElement != null || 
  pullableContent != null
)

const createPullToRefreshStatusRepository = (): PullToRefreshRepository => ({
  refreshStarted: false,
  refreshCompleted: false,
  startRefresh(): void {
    this.refreshStarted = true
  },
  completeRefresh(): void {
    this.refreshCompleted = true
  }
})

const createTouchCoordinates = (x: number, y: number): Point => ({ x, y })

const getTouchesCoordinatesFrom = (event: TouchEvent): Point => {
  return createTouchCoordinates(
    event.targetTouches[0].screenX,
    event.targetTouches[0].screenY
  )
}

const startPullToRefresh = (pullToRefreshElement: HTMLElement, pullToRefreshStatusElement: HTMLElement, pullToRefreshLoaderElement: HTMLElement, pullableContent: HTMLElement): void => {
  const pullToRefreshElementHeight = 100
  const pullToRefreshStatusRepository = createPullToRefreshStatusRepository()
  const decelerationFactor = 0.5
  let dragStartPoint = createTouchCoordinates(0, 0)

  const dragUpdate = (dragMovement: number, pullToRefreshLoaderOpacity: number): void => {
    pullToRefreshElement.style.transform = `translateY(${dragMovement}px)`
    pullableContent.style.transform = `translateY(${dragMovement}px)`
    pullToRefreshLoaderElement.style.opacity = `${pullToRefreshLoaderOpacity}`
  }

  const isDraggingForPullToRefresh = (yMovement: number): boolean => window.scrollY <= 0 && yMovement <= 0

  const closePullToRefresh = (): void => {
    addCssClass(pullToRefreshElement, 'end-pull')
    addCssClass(pullableContent, 'end-pull')
    pullToRefreshElement.style.transform = ''
    pullableContent.style.transform = ''
    pullToRefreshLoaderElement.style.opacity = '0'
  }

  const preparePullToRefreshToStart = (): void => {
    addCssClass(pullToRefreshElement, 'start-pull')
    removeCssClass(pullToRefreshElement, 'end-pull')
    addCssClass(pullableContent, 'start-pull')
    removeCssClass(pullableContent, 'end-pull')
  }

  const showPullToRefresh = (): void => {
    addCssClass(pullToRefreshElement, 'visible-pull')
    removeCssClass(pullToRefreshElement, 'hidden-pull')
  }

  const setRefreshingStatus = (): void => {
    pullToRefreshStatusElement.innerHTML = 'Refreshing'
    addCssClass(pullToRefreshLoaderElement, 'animate')
  }

  const isPullToRefreshDragCompleted = (yAbsoluteMovement: number): boolean => yAbsoluteMovement >= pullToRefreshElementHeight

  const setRefreshStatusCompleted = (): void => {
    pullToRefreshStatusElement.innerHTML = 'Refresh completed'
    addCssClass(pullToRefreshElement, 'hidden-pull')
    removeCssClass(pullToRefreshElement, 'visible-pull')
  }

  const resetPullToRefreshStatus = (): void => {
    pullToRefreshStatusElement.innerHTML = 'Pull down to refresh'
    removeCssClass(pullToRefreshLoaderElement, 'animate')
  }

  document.addEventListener('touchstart', (event: TouchEvent) => {
    dragStartPoint = getTouchesCoordinatesFrom(event)
    preparePullToRefreshToStart()
  }, { passive: false })

  document.addEventListener('touchmove', (event: TouchEvent) => {
    const dragCurrentPoint = getTouchesCoordinatesFrom(event)
    const yMovement: number = (dragStartPoint.y - dragCurrentPoint.y) * decelerationFactor
    const yAbsoluteMovement: number = Math.abs(yMovement)

    if (isDraggingForPullToRefresh(yMovement) && !pullToRefreshStatusRepository.refreshStarted) {
      event.preventDefault()
      event.stopPropagation()
      showPullToRefresh()

      if (isPullToRefreshDragCompleted(yAbsoluteMovement)) {
        pullToRefreshStatusRepository.startRefresh()
        dragUpdate(0, 1)
        setRefreshingStatus()
        sendMessageToServiceWorker({ message: 'refresh' }).then(() => {
          pullToRefreshStatusRepository.completeRefresh()
          setTimeout(() => {
            setRefreshStatusCompleted()
            closePullToRefresh()
          }, 1500)
        })
      } else {
        dragUpdate(yAbsoluteMovement - pullToRefreshElementHeight, yAbsoluteMovement / pullToRefreshElementHeight)
      }
    }
  }, { passive: false })

  document.addEventListener('touchend', () => {
    if (!pullToRefreshStatusRepository.refreshStarted) {
      closePullToRefresh()
    }
  }, { passive: false })

  pullToRefreshElement.addEventListener('transitionend', () => {
    if (pullToRefreshStatusRepository.refreshCompleted) {
      window.location.reload()
    } else {
      resetPullToRefreshStatus()
    }
  })
}

const pullToRefresh = (): void => {
  if (!isServiceWorkerSupported()) {
    return
  }

  const pullToRefreshElement: HTMLElement | null = document.querySelector<HTMLElement>('#pull-to-refresh')
  const pullToRefreshStatusElement: HTMLElement | null = document.querySelector<HTMLElement>('#pull-to-refresh-status')
  const pullToRefreshLoaderElement: HTMLElement | null = document.querySelector<HTMLElement>('#pull-to-refresh-loader')
  const pullableContent: HTMLElement | null = document.querySelector<HTMLElement>('.pullable-content')

  if(areAllAvailable(pullToRefreshElement, pullToRefreshStatusElement, pullToRefreshLoaderElement, pullableContent)) {
    startPullToRefresh(
      pullToRefreshElement as HTMLElement,
      pullToRefreshStatusElement as HTMLElement, 
      pullToRefreshLoaderElement as HTMLElement, 
      pullableContent as HTMLElement
    )
  }
}

export { pullToRefresh }
