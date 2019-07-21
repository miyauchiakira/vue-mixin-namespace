# vue-mixin-namespace
This module provides a namespace for Vue mixin.

Declare explicitly the dependency between a component and a mixin file. Make them loose coupling.

Required: Vue 2, ECMAScript 2019


# Usage
### Using a mixin's property in a component's property
You can access the mixin's property via `this[namespace]`.

For example, if namespace is `somethingable` and method name is `some_method`, you can call the method by `this.somethingable.some_method()`.


### Using a component's property in a mixin's property
You need to declare the property's name in `global` property. If you did so, you can access via `this`, as non-namespaced mixin.

### Example code

```JavaScript
// component.vue

import { with_namespace } from “vue-mixin-namespace.js”
import Somethingable from “somethingable.js”

export default {

	mixins: with_namespace({
		somethingable: Somethingable,
	}),
	
	data() {
		return {
			some_value: 123,
			foo: 456,
			bar: 789,
		}
	},

	methods: {
		some_method() {
			this.some_value	// 123
			this.somethingable.some_value	// 'abc'
			this.hoge	// undefined
			this.somethingable.hoge	// 'def'
		},
	},
	
	// computed, watch, inject, created...
}
```

```JavaScript
// somethingable.js

export default {
	
	// Properties which import from the component.
	global: [
		'foo',
		// data names, method names, computed property names,,,
	],
	
	data() {
		return {
			some_value: 'abc',
			hoge: 'def',
			piyo: 'ghi',
		}
	},
	
	methods: {
		some_method() {
			this.some_value	// 'abc'
			this.foo	// 456
			this.bar	// undefined : Declare 'bar' in global if you want to use.
			this.$el	// undefined : Declare '$el' in global if you want to use.
			this.hoge	// 'def'
		},
	},
	
	// computed, watch, inject, created...
}
```


# Install
Just download a "vue-mixin-namespace.js" file and import it.

This module uses latest ECMAScript syntax, like Object.fromEntries(). Please use Babel to transpile them.


# FAQ

### What properties can I use in namespaced mixin?
- data
- computed (⭕️function ❌object)
- methods
- watch (⭕️function, object)
- inject (⭕️array ❌object)
- created
- globals ← This module's feature

### How to use namespaced mixin with non-namespaced mixin?
Use spread syntax to merge them.

```
mixins: [
	Fooable,
	Buzzable,
	... with_namespace({
		somethingable: Somethingable,
	})
],
```


# Licence
[MIT](https://opensource.org/licenses/mit-license.php)
