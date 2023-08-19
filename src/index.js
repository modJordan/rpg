import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import { Farmer } from './farmer';

document.addEventListener("DOMContentLoaded", function () {
  const char = new Farmer();
  char.bind_keyboard_events();
});
