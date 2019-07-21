# vue-mixin-namespace
[English Document (英語)](README_ja.md)

このモジュールは、Vueのミックスインを名前空間付きで読み込めるようにします。

コンポーネントファイルとミックスインファイルの依存関係を明確にすることができます。

環境: Vue 2, ECMAScript 2019


# 使用方法
### コンポーネント内で、ミックスインのプロパティを呼び出す
`this[namespace]`のように書くことで、ミックスインのプロパティを使うことができます。

例えば`somethingable`という名前空間内の`some_method`を呼び出したければ、`this.somethingable.some_method()`のように書いてください。


### ミックスイン内で、コンポーネントのプロパティをを呼び出す
ミックスイン内の`global`プロパティで、使いたいコンポーネントのプロパティ名を指定する必要があります。そうすることで`this`から呼び出すことができます。


### プログラム例

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
	
	// コンポーネント側から呼び出して使いたいプロパティたち
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
			this.bar	// undefined : globalの中に'bar'を追加する必要があります
			this.$el	// undefined : globalの中に'$el'を追加する必要があります
			this.hoge	// 'def'
		},
	},
	
	// computed, watch, inject, created...
}
```


# インストール
このプロジェクトに含まれている"vue-mixin-namespace.js"ファイルをダウンロードして、あなたのプロジェクトに追加してください。
`import { with_namespace } from “vue-mixin-namespace.js”`をすることで使えるようになります。

このモジュールでは`Object.fromEntries()`など、最新のECMAScript構文を使っています。Babelなどを用いてトランスパイルしてください。


# FAQ

### 名前空間付きミックスインでは、どのプロパティが使えますか？
- data
- computed (⭕️function ❌object)
- methods
- watch (⭕️function, object)
- inject (⭕️array ❌object)
- created
- globals ← このモジュール専用のプロパティです

### 名前空間付きミックスインと名前空間無しのミックスインを一緒に読み込むにはどうしたらいいですか？
スプレッド構文`...`を使って連結してください。

```
mixins: [
	Fooable,
	Buzzable,
	... with_namespace({
		somethingable: Somethingable,
	})
],
```


# ライセンス
[MIT](https://opensource.org/licenses/mit-license.php)
