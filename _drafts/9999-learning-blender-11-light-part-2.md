---
layout: post
title: "Learning Blender: light - part 2"
description: "In this new post of the series "Learning Blender" I will talk about about how to do other cool stuff with lights in Blender."
date: 2017-11-25
image: TO DO
tags: [computer graphics, blender]
comments: true
seo:
  - type: "BlogPosting"
---

*In this new post of the series "Learning Blender" I will talk about about how to do other cool stuff with lights in Blender.*

---

In the [previous post of the series "Learning Blender"](TODO) we talked about light in Blender. In this post we 
will continue to talk lights in Blender.  
We will start by exploring how it is possible to add a light background and setup ambient light. We can setup these 
options in the world property panel. Inside it we have a section "world" in which we can modify the background of our
 scene. We have some option to customize the final background result:
 
 * blend sky, if enabled blends the horizon and zenith sky
 * paper sky, if enabled with blend sky it maps the background colors to a plane
 * real sky, if enabled place the horizon color in the middle (as real sky)
 
In the same section there's also a ambient color property. The ambient color let us manage the overall light color.

![blender background ambient color](/assets/images/posts/blender-background-ambient-color.jpg "blender background ambient color")

We can also choose to add a background image. To do that we have to go from the world tab directly to the texture tab
. Blender will detect this operation and it will know that we are adding a texture to the background of our scene. 
From here we can choose the type of texture we want and we can apply it.

![blender background texture](/assets/images/posts/blender-background-texture.jpg "blender background texture")

We also have a specific type of light to simulate the sun: the sun lamp. It behaves in a similar way to the Hemi lamp
. One particular feature it has is the possibility to add a sky as background and simulate a sun in terms of shape 
and effects.   
Last but not least we have ambient occlusion....

 