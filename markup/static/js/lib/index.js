export function Component({selector = ''}) {
  return function(target) {
    return new class extends target {
      constructor(...args) {

        console.log('from decorator', document.querySelector(selector))

        super(...args)

        if (document.querySelector(selector) === null) return;
      }
    }
  }
}
