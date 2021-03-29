import { onClientExec } from '../../utils/arch'

onClientExec(function () {
  require('./TTSConfig.tests')
  require('./TTSEngine.tests')
  require('./ServerTTS.tests')
  require('./BrowserTTS.tests')
})
