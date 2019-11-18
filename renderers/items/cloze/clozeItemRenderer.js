import './clozeItemRenderer.html'

const inputRegex = new RegExp('{{.+}}', 'g')
const openBracket = '{{'
const closeBracket = '}}'

Template.clozeItemRenderer.helpers({
  tokens () {
    const { value } = Template.instance().data
    if (!value) return

    let startIndex = 0, endIndex = 0
    const tkns = []
    while (startIndex < value.length && startIndex > -1) {
      startIndex = value.indexOf(openBracket, endIndex)

      if (startIndex === -1 || startIndex >= value.length) {
        // no open bracket is found, we still try to add the rest of the words
        // that may remain in the value string until the end
        tkns.push({ value: value.substring(endIndex, value.length) })
        break
      }

      // add previous words
      tkns.push({ value: value.substring(endIndex, startIndex) })

      // add input related words
      endIndex = value.indexOf(closeBracket, startIndex)
      tkns.push({ isInput: true, value: value.substring(startIndex + openBracket.length, endIndex) })
      endIndex += closeBracket.length
    }
    console.log(tkns)
    return tkns
  }
})