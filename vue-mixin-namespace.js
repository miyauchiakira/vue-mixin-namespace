/*!
 * vue-mixin-namespace.js v1.02
 * (c) 2019 Miyauchi Akira
 * Released under the MIT License.
 */

function namespaced_mixin({namespace, mixin}) {
	
	const computed = {}

	computed[namespace] = function() {

		const result = {}

		// global (Symbolic Link)
		if(mixin.global) {
			mixin.global.forEach(name => {
				Object.defineProperty(result, name, {
					get: () => {
						return this[name]
					},

					set: (value) => {
						this[name] = value
					},
				})
			})
		}

		// inject (Symbolic Link)
		if(mixin.inject) {
			mixin.inject.forEach(name => {
				Object.defineProperty(result, name, {
					get: () => {
						return this[name]
					},

					set: (value) => {
						this[name] = value
					},
				})
			})
		}

		// data (Symbolic Link)
		if(mixin.data) {
			const names = Object.keys(mixin.data())

			names.forEach(name => {
				Object.defineProperty(result, name, {
					get: () => {
						return this[`namespaces__${namespace}`][name]
					},

					set: (value) => {
						this[`namespaces__${namespace}`][name] = value
					},
				})
			})
		}

		// computed (Symbolic Link)
		if(mixin.computed) {
			const names = Object.keys(mixin.computed)

			names.forEach(name => {
				Object.defineProperty(result, name, {
					get: () => {
						return this[`namespaces__${namespace}_${name}`]
					},

					set: (value) => {
						this[`namespaces__${namespace}_${name}`] = value
					},
				})
			})
		}

		// methods (Entity)
		if(mixin.methods) {
			const methods = Object.fromEntries(Object.entries(mixin.methods).map(([name, func]) => ([name, func.bind(result)])))

			Object.assign(result, methods)
		}

		return result
	}

	// data (Entity)
	function data() {
		const result = {}
		if(mixin.data) {
			result[`namespaces__${namespace}`] = mixin.data()
		}
		return result
	}

	// inject (Entity)
	let inject = []
	if(mixin.inject) {
		inject = mixin.inject
	}

	// computed (Entity)
	if(mixin.computed) {
		Object.entries(mixin.computed).forEach(([key, value]) => {
			computed[`namespaces__${namespace}_${key}`] = function() {
				return value.bind(this[namespace])()
			}
		})
	}

	// watch (Entity)
	const watch = {}
	if(mixin.watch) {
		Object.entries(mixin.watch).forEach(([key, value]) => {
			
			if(typeof value === 'function') {
				watch[`${namespace}.${key}`] = function() {
					value.bind(this[namespace])(...arguments)
				}
				
			} else if(typeof value === 'object') {

				const obj = {...value}
				obj.handler = function() {
					value.handler.bind(this[namespace])(...arguments)
				}
				watch[`${namespace}.${key}`] = obj
			}
		})
	}

	// created
	let created = null
	if(mixin.created) {
		created = function() {
			mixin.created.bind(this[namespace])()
		}
	}

	return { data, inject, created, watch, computed }
}

export function with_namespace(mixins) {
	return Object.entries(mixins).map(([namespace, mixin]) => {
		return namespaced_mixin({namespace, mixin})
	})
}
