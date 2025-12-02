

// 1. Config for controls
const controlsNumber = [
    {
        label: 'Letter Spacing',
        // value: 1000,
        min: 0,
        max: 1000,
        path: 'parameters.spacing', // -> font > config > width
    },
    {
        label: 'Width',
        // value: 1000,
        min: 200,
        max: 2000,
        path: 'parameters.width', // -> font > config > width
    },
    {
        label: 'Radius',
        min: 20,
        max: 500,
        path: 'parameters.radius', // -> font > config > radius
    },
    {
        label: 'Copies',
        min: 1,
        max: 30,
        path: 'parameters.copies.count', // -> font > config > radius
    },
    {
        label: 'Copy Offset Scale',
        min: -10,
        max: 20,
        path: 'parameters.copies.offset.scale', // -> font > config > radius
    },
    {
        label: 'Copy Offset X',
        min: -100,
        max: 100,
        path: 'parameters.copies.offset.x', // -> font > config > radius
    },
    {
        label: 'Copy Offset Y',
        min: -100,
        max: 100,
        path: 'parameters.copies.offset.y', // -> font > config > radius
    },
    {
        label: 'Rotation',
        min: 0,
        max: 360,
        path: 'parameters.rotation', // 旋转角度控制
    }
]

// 2. Controls for Grid
const controlsSwitch = [
    {
        label: 'Show Grid',
        path: 'parameters.showGrid',
        value: true
    }
]

// 3. Controls for Background Color
const controlsColor = [
    {
        label: 'Background',
        path: 'parameters.backgroundColor',
        defaultValue: '#ffffff'
    }
]



// Helper function to update preview in control panel
const updatePreview = () => {
    const svgPreview = document.getElementById('svg-preview')
    if (!svgPreview) return
    
    svgPreview.innerHTML = '' // Clear previous preview
    
    // Render a small preview text "ABC"
    const previewText = 'ABC'
    const spacing = bitmapFont.parameters.spacing
    
    // Calculate total width needed for all characters
    const width = bitmapFont.parameters.width
    const height = bitmapFont.parameters.height
    const radius = bitmapFont.parameters.radius
    const columns = bitmapFont.parameters.columns
    const rows = bitmapFont.parameters.rows
    const gridUnitWidth = width / columns
    const gridUnitHeight = height / rows
    
    // Calculate the total width including spacing and potential overflow from radius
    const totalTextWidth = previewText.length * width + (previewText.length - 1) * spacing
    const maxRadius = radius * 1.5 // Account for the outer radius of lines
    const padding = maxRadius * 2
    
    // Set viewBox to center the content
    const viewBoxWidth = totalTextWidth + padding * 2
    const viewBoxHeight = height + padding * 2
    const viewBoxX = -padding
    const viewBoxY = -padding
    
    svgPreview.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`)
    svgPreview.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    
    let xOffset = padding // Start with padding offset to center
    for (let i = 0; i < previewText.length; i++) {
        const char = previewText[i]
        const glyph = bitmapFont.glyphs[char] || bitmapFont.glyphs['.notdef']
        
        const glyphGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        glyphGroup.setAttribute('transform', `translate(${xOffset}, ${padding})`)
        
        // Render pixels for each character
        glyph.forEach((pixel, index) => {
            if (pixel === 1) {
                const x = (index % columns) * gridUnitWidth
                const y = Math.floor(index / columns) * gridUnitHeight
                
                // Create pixel element with proper rendering
                const pixelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
                pixelGroup.style.mixBlendMode = 'difference'
                pixelGroup.style.color = '#ffffff'
                
                // Use simple circle for preview to ensure visibility
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                circle.setAttribute('cx', x + gridUnitWidth / 2)
                circle.setAttribute('cy', y + gridUnitHeight / 2)
                circle.setAttribute('r', radius * 0.8)
                circle.setAttribute('fill', 'currentColor')
                
                pixelGroup.appendChild(circle)
                glyphGroup.appendChild(pixelGroup)
            }
        })
        
        svgPreview.appendChild(glyphGroup)
        xOffset += width + spacing
    }
}

// 2. Applied range slider controls to dom
const controlWrapper = document.getElementById('controls')

controlsNumber.forEach((control) => {

    const initialValue = _.get(bitmapFont, control.path)

    // Create the input element
    const input = document.createElement('input')
    input.type = "range"
    input.min = control.min
    input.max = control.max
    input.defaultValue = initialValue
    input.id = control.path

    // Add the input control
    input.oninput = (e) => {

        label.innerHTML = control.label + `[${_.get(bitmapFont, control.path)}]`

        // Set allows us to set valus inside an object
        // 1) your entire font
        // 2) adjust the value at the given path
        // 3) change tha value at the path!
        _.set(bitmapFont, control.path, parseFloat(e.currentTarget.value))

        // everytime a value is updated, we refresh the font rendering
        const typedCharacter = bitmapFont.preview.character

        // First remove previous Glyph
        emptyCanvas()

        // First we update the grid (we might have changed the columns!)
        renderGrid()

        // Render Text
        // const textGroup = 
        renderText(typedCharacter)

        // svgText.appendChild(textGroup)
        
        // Update preview in control panel
        updatePreview()

    }

    const label = document.createElement('label')
    label.innerHTML = control.label + `[${_.get(bitmapFont, control.path)}]`
    label.htmlFor = control.path

    controlWrapper.appendChild(label)
    controlWrapper.appendChild(input)

})


// 3. Applied color controls to dom
controlsColor.forEach((control) => {
    
    const initialValue = _.get(bitmapFont, control.path) || control.defaultValue

    // Create the input element
    const input = document.createElement('input')
    input.type = "color"
    input.defaultValue = initialValue
    input.id = control.path

    // Add the input control
    input.oninput = (e) => {
        const value = e.currentTarget.value
        _.set(bitmapFont, control.path, value)
        
        // Apply background color to main container and aside
        document.getElementById('main').style.backgroundColor = value
        document.getElementById('aside').style.backgroundColor = value
        
        // Adjust text color based on background brightness
        const rgb = parseInt(value.slice(1), 16)
        const r = (rgb >> 16) & 0xff
        const g = (rgb >> 8) & 0xff
        const b = (rgb >> 0) & 0xff
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        const textColor = brightness > 128 ? '#000000' : '#ffffff'
        
        document.getElementById('aside').style.color = textColor
        document.getElementById('svg-preview').style.color = textColor
        
        // Update slider colors
        document.querySelectorAll('input[type=range]').forEach(slider => {
            slider.style.setProperty('--slider-color', textColor)
        })
        
        // Update color input borders
        document.querySelectorAll('input[type=color]').forEach(colorInput => {
            colorInput.style.borderColor = textColor
        })
        
        // Update preview
        updatePreview()
        
        label.innerHTML = control.label + ` [${value}]`
    }

    const label = document.createElement('label')
    label.innerHTML = control.label + ` [${initialValue}]`
    label.htmlFor = control.path

    controlWrapper.appendChild(label)
    controlWrapper.appendChild(input)

    // Apply initial background color
    document.getElementById('main').style.backgroundColor = initialValue
    document.getElementById('aside').style.backgroundColor = initialValue
    
    // Adjust initial text color based on background brightness
    const rgb = parseInt(initialValue.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    const textColor = brightness > 128 ? '#000000' : '#ffffff'
    document.getElementById('aside').style.color = textColor
    document.getElementById('svg-preview').style.color = textColor
    
    // Update slider colors
    document.querySelectorAll('input[type=range]').forEach(slider => {
        slider.style.setProperty('--slider-color', textColor)
    })
    
    // Update color input borders
    document.querySelectorAll('input[type=color]').forEach(colorInput => {
        colorInput.style.borderColor = textColor
    })
})

// Initialize preview after all controls are set up
setTimeout(() => {
    updatePreview()
}, 100)

// Toggle controls functionality
const toggleBtn = document.getElementById('toggle-controls')
const showBtn = document.getElementById('show-controls-btn')
const controlsWrapper = document.getElementById('controls-wrapper')
const aside = document.getElementById('aside')
const mainArea = document.getElementById('main')
const container = document.getElementById('container')
let controlsVisible = true

const showControls = () => {
    if (!controlsVisible) {
        controlsVisible = true
        aside.classList.remove('hidden')
        container.classList.remove('controls-hidden')
        showBtn.classList.remove('visible')
    }
}

const hideControls = () => {
    if (controlsVisible) {
        controlsVisible = false
        aside.classList.add('hidden')
        container.classList.add('controls-hidden')
        showBtn.classList.add('visible')
    }
}

// Click on hide button in control panel
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    hideControls()
})

// Click on show button
showBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    showControls()
})

// Click on main area to hide controls
mainArea.addEventListener('click', (e) => {
    hideControls()
})

// Prevent control panel clicks from hiding
aside.addEventListener('click', (e) => {
    e.stopPropagation()
})

// Update color input borders when background changes
const updateColorInputBorders = () => {
    const colorInputs = document.querySelectorAll('input[type=color]')
    colorInputs.forEach(input => {
        const currentColor = getComputedStyle(aside).color
        input.style.borderColor = currentColor
    })
}

// Call this initially and when background changes
updateColorInputBorders()

// Create radial lines for the show button
const createRadialButton = () => {
    const radialGroup = document.getElementById('radial-lines')
    if (!radialGroup) return
    
    const numLines = 24 // 放射线数量
    const centerX = 50
    const centerY = 50
    const innerRadius = 20 // 内圆半径
    const outerRadius = 45 // 外圆半径
    
    for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        
        // 计算线条的起点和终点
        const x1 = centerX + Math.cos(angle) * innerRadius
        const y1 = centerY + Math.sin(angle) * innerRadius
        const x2 = centerX + Math.cos(angle) * outerRadius
        const y2 = centerY + Math.sin(angle) * outerRadius
        
        // 创建线条
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', x1)
        line.setAttribute('y1', y1)
        line.setAttribute('x2', x2)
        line.setAttribute('y2', y2)
        line.setAttribute('stroke', 'currentColor')
        line.setAttribute('stroke-width', '2')
        line.setAttribute('stroke-linecap', 'round')
        
        radialGroup.appendChild(line)
    }
}

// Initialize the radial button
createRadialButton()


controlsSwitch.forEach((control) => {
    
    // 1. Setting up the controls 
    const initialValue = _.get(bitmapFont, control.path)

    // Create the input element
    const input = document.createElement('input')
    input.type = "checkbox"
    input.defaultChecked = initialValue
    // input.defaultValue = initialValue
    input.id = control.path
    input.innerHTML = "Show Grid"
    input.name = "Show Grid"

    // 2. Handle the controls action

    // Add the input control
    input.oninput = (e) => {


        const value = e.currentTarget.checked


        if(value){
            svgText.classList.add('showGrid')
        }else{
            svgText.classList.remove('showGrid')
        }
    }

    const label = document.createElement('label')
    label.innerHTML = control.label + `[${_.get(bitmapFont, control.path)}]`
    label.htmlFor = control.path

    controlWrapper.appendChild(label)
    controlWrapper.appendChild(input)

})
