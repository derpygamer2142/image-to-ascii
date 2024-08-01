const canv = document.getElementById("canv")
const ctx = canv.getContext("2d")
const asciidiv = document.getElementById("asciiimage")

//const densities = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'."
const densities = ".:-=+*#%@"

const img = new Image(100, 100)
img.src = "blankets.png"

function toArray(x, y, width, offset) {
    return (((y * width) + x) * 4) + offset
}

let final = []

function smoothstep(a, b, x) {
    let t = Math.max(0, Math.min(1, (x - a) / (b - a)))
    return t*t*t*(t*(6 * t - 15) + 10)
}

function smootherstep(a, b, x) {
    let t = Math.max(0, Math.min(1, (x - a) / (b - a)))
    return t*t*(3-(2*t))
}

img.addEventListener("load", (e) => {
    canv.width = img.width
    canv.height = img.height
    ctx.drawImage(img,0,0,canv.width,canv.height)

    const canvdata = ctx.getImageData(0,0,canv.width,canv.height)
    const pixels = canvdata.data

    for (let y = 0; y < canv.height; y++) {
        let text = ""
        for (let x = 0; x < canv.width; x++) {
            const r = pixels[toArray(x, y, canv.width, 0)]
            const g = pixels[toArray(x, y, canv.width, 1)]
            const b = pixels[toArray(x, y, canv.width, 2)]
            
            //let luminance = 1 - ((r + b + g) / 765)
            let luminance = ((r/255 * 0.299) + (g/255 * 0.587) + (b/255 * 0.114))
            luminance = smootherstep(0,1,luminance)
            text += densities[Math.round(luminance * (densities.length - 1))]
        }
        final.push(text)
    }

    final.forEach((e) => {
        const newelement = document.createElement("p")
        newelement.innerText = e
        asciidiv.appendChild(newelement)
    })
})