import { onClientExec } from '../../utils/arch'

onClientExec(function () {
  import './TTSConfig.tests'
  import './TTSEngine.tests'
  import './ServerTTS.tests'
  import './BrowserTTS.tests'
})
