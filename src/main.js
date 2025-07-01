import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faGraduationCap, 
  faTrash, 
  faTrophy, 
  faChartLine, 
  faLightbulb, 
  faKeyboard,
  faStar,
  faMedal,
  faFire,
  faCrown,
  faGem,
  faRocket,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faGraduationCap, 
  faTrash, 
  faTrophy, 
  faChartLine, 
  faLightbulb, 
  faKeyboard,
  faStar,
  faMedal,
  faFire,
  faCrown,
  faGem,
  faRocket,
  faTimes
)

const app = createApp(App)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
