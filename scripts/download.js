
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// 1. Copy Vector to Illustrator

const btnCopyText = document.getElementById('btn-copy-text')


btnCopyText.onclick = () => {

    const svgLetter = document.getElementById("svg-text")
    const clone = svgLetter.cloneNode(true);

    const grid = clone.querySelectorAll('.grid')

    grid.forEach(gridElement => {
        gridElement.remove()
    })

    // const svgString = clone.outerHTML;
    const svgString = new XMLSerializer().serializeToString(clone);

    navigator.clipboard.writeText(svgString)

}
