import { Components } from './components/Components'
import { TaskRenderers } from './renderers/Renderers'
import { TTSEngine } from './tts/TTSEngine'
import { i18n} from './i18n/i18n'

export const LeaCoreLib = {}

LeaCoreLib.i18n = i18n

LeaCoreLib.components = Components

LeaCoreLib.renderers = TaskRenderers

LeaCoreLib.ttsEngine = TTSEngine
