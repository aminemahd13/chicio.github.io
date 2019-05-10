/* @flow */
import 'intersection-observer'
import { addCssClass, removeCssClass } from './css-class'

const lazyLoadImages = (selector: string): void => {
  const intersectionObserver: IntersectionObserver = new IntersectionObserver(
    onIntersection,
    { rootMargin: '50px 0px', threshold: 0.01 }
  )
  document.querySelectorAll(selector).forEach(image => intersectionObserver.observe(image))
}

const onIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      eventuallyLoadImage(entry.target)
    }
  })
}

const eventuallyLoadImage = (element: HTMLElement): void => {
  if (element instanceof HTMLImageElement) {
    loadImage(element)
  }
}

const loadImage = (image: HTMLImageElement): void => {
  image.src = image.dataset.src
  image.onload = () => {
    removeCssClass(image, 'lazy')
    addCssClass(image, 'lazy-show')
  }
}

export { lazyLoadImages }
