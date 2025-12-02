// Rendering a Pixel

// Parameters
// x – Postion
// y - Position
// radius – Scale
// index – Each iteration

const renderPixel = (x, y, radius, index) => {
    // Ofset per item
    const xOfst = bitmapFont.parameters.copies.offset.x * (index)
    const yOfst = bitmapFont.parameters.copies.offset.y * (index)

    // Create a group to hold all the radial lines
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // 添加混合模式实现颜色反转效果
    group.style.mixBlendMode = 'difference'; // 'difference' 是差值模式（颜色反转）
    // 设置为白色，这样在任何背景下都会通过差值模式显示为对比色
    group.style.color = '#ffffff';
    
    // Number of lines radiating from center
    const numLines = 36; // 每10度一条线
    
    // Inner and outer radius for the lines
    const innerRadius = radius * 0.3; // 内半径（中心空白区域）
    const outerRadius = radius * 1.5; // 外半径（线条延伸长度）
    
    // Create radial lines
    for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        
        // Calculate line endpoints
        const x1 = Math.cos(angle) * innerRadius;
        const y1 = Math.sin(angle) * innerRadius;
        const x2 = Math.cos(angle) * outerRadius;
        const y2 = Math.sin(angle) * outerRadius;
        
        // Create line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'currentColor'); // 使用当前颜色
        line.setAttribute('stroke-width', radius * 0.15); // 线条宽度
        line.setAttribute('stroke-linecap', 'butt'); // 线条端点样式
        
        group.appendChild(line);
    }
    
    // Position the group at the pixel location with rotation
    const rotation = bitmapFont.parameters.rotation || 0;
    // 使用位置作为随机种子，让相同位置的圆旋转方向保持一致
    const randomSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    const randomDirection = (randomSeed - Math.floor(randomSeed)) > 0.5 ? 1 : -1; // 随机顺时针或逆时针
    const finalRotation = rotation * randomDirection;
    
    group.setAttribute('transform', `translate(${x + xOfst}, ${y + yOfst}) rotate(${finalRotation})`);
    
    return group;
}



const renderPixel2 = (x, y, radius, index) => {



    const scale = radius/100-index*0.01 * 2

    // Ofset per item
    const xOfst = (bitmapFont.parameters.copies.offset.x * (index)) - scale*50
    const yOfst = (bitmapFont.parameters.copies.offset.y * (index)) - scale*50

    // now we are handling the logic for placing the circles
    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Storing path as string
    const path = `M39.17,40.89c2.39,31.35-23.87,69.37-30.71,40.26S62.71,2.86,41.39,16.71C20.07,30.55.34,60.62.5,39.14c.16-21.48,56.01-58.55,63.01-25.46,7,33.1-1.59,35.8,16.55,28.16,18.14-7.64,8.59,78.92-14.64,49.96-23.23-28.96-26.25-50.92-26.25-50.92Z`

    // Adding Path as attribute
    newPath.setAttribute('d', path) 

    // transforming path
    newPath.setAttribute('transform', `translate(${x+xOfst}, ${y+yOfst}) scale(${scale})`)

    return newPath
}

// const renderPixel = (x, y, radius, index) => {

//     x = x - radius + bitmapFont.parameters.copies.offset.x
//     y = y - radius + bitmapFont.parameters.copies.offset.y
//     // now we are handling the logic for placing the circles
//     const newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//     newCircle.setAttribute('width', radius*2);
//     newCircle.setAttribute('height', radius*2);
//     newCircle.setAttribute('x', x)
//     newCircle.setAttribute('y', y)
//     newCircle.setAttribute('transform', `rotate(${index * 10}, ${x}, ${y})`)

//     return newCircle
// }




