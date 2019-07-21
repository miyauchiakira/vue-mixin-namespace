# vue-mixin-namespace
It provides a namespace for Vue mixin.

Declare explicitly the dependency between a component and a mixin file. Make them loose coupling.

Required: Vue 2, ECMAScript 2019

# Usage
## without vue-mixin-namespace

```JavaScript
// component.vue

import Somethingable from “somethingable.js”

mixin: [
	Somethingable
]
```

```JavaScript
// somethingable.js

export default {
	
	data() {
		return {
			is_touching: false,
		}
	},
	
	methods: {

		start() {
			this.is_touching = true
			
			this.absolute = {
				x: event.pageX || event.changedTouches[0].pageX,	// PC&スマホ
				y: event.pageY || event.changedTouches[0].pageY,	// PC&スマホ
			}

			this.start_point = this.absolute

			const mousemove = this.move.bind(this)
			window.addEventListener('mousemove', mousemove)
			window.addEventListener('touchmove', mousemove)

			const mouseup = () => {
				window.removeEventListener('mousemove', mousemove)
				window.removeEventListener('touchmove', mousemove)
				this.end()
			}

			window.addEventListener('mouseup', mouseup, {once: true})
			window.addEventListener('touchend', mouseup, {once: true})

			this.move()
		},
	},
}
```

## with vue-mixin-namespace

```JavaScript
// component.vue

import {with_namespace} from “vue-mixin-namespace.js”
import Somethingable from “somethingable.js”

mixin: with_namespace({
	somethingable: Somethingable
})
```

```JavaScript
// somethingable.js

export default {
	
	data() {
		return {
			is_touching: false,
		}
	},
	
	methods: {

		start() {
			this.is_touching = true
			
			this.absolute = {
				x: event.pageX || event.changedTouches[0].pageX,	// PC&スマホ
				y: event.pageY || event.changedTouches[0].pageY,	// PC&スマホ
			}

			this.start_point = this.absolute

			const mousemove = this.move.bind(this)
			window.addEventListener('mousemove', mousemove)
			window.addEventListener('touchmove', mousemove)

			const mouseup = () => {
				window.removeEventListener('mousemove', mousemove)
				window.removeEventListener('touchmove', mousemove)
				this.end()
			}

			window.addEventListener('mouseup', mouseup, {once: true})
			window.addEventListener('touchend', mouseup, {once: true})

			this.move()
		},
	},
}
```

Add explanation about
globals and this.somethingable

# Install
Just download a "vue-mixin-namespace.js" file and import it.

This module uses latest ECMAScript syntax, like Object.fromEntries(). Please use Babel to transpile them.

# FAQ

### How to use namespaced mixin with non-namespaced mixin?
Use spread syntax to merge them.

```
mixins: [
	require('./chunk-draggable.mixin.js').default,
	... with_namespace({
		touchable: require('global/mixins/touchable.js').default,
	})
],
```

### What properties can I use in namespaced mixin?
- data
- computed (⭕️function ❌object)
- methods
- watch (⭕️function, object)
- inject (⭕️array ❌object)
- created
- globals ← This module's feature


# Licence
MIT
