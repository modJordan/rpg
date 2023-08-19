import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import { Farmer } from './farmer';

document.addEventListener("DOMContentLoaded", function () {
  var char = new Farmer();
  char.init();
});