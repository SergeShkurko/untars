import { Component } from '../../static/js/lib'

@Component({
  selector: '.creative-',
})
export default class Creative {
  constructor() {
    console.log('test from module')
  }
  inited() {
    console.log('module inited')
  }
  notExist() {
    console.log('module notExist')
  }
}
