import randomColor from 'randomcolor';

function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return (
        'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.1)'
      );
    }
    throw new Error('Bad Hex');
  }
  
  const good_color_palette = [
    '#00b894', // green
    '#0984e3', // blue
    '#6c5ce7', // purple
    '#fdcb6e', // yellow
    '#e17055', // orange
    '#d63031', // red
    '#e84393', // pink
    '#9A6324', // turquoise
    '#55efc4', // light green
    '#74b9ff', // light blue
    '#a29bfe', // light purple
    '#ffeaa7', // light yellow
    '#fab1a0', // light orange
    '#ff7675', // pink
  ];
  
  
  // let unique_colors =
  let color_palette = randomColor({
    count: 5000,
    format: 'rgba',
    hue: 'red, orange,blue, purple',
    luminosity: 'dark',
    // alpha: 0.6 // e.g. 'rgba(9, 1, 107, 0.5)',
    // hue: 'green'
  });
  
  let final_color_palette = [...good_color_palette, ...color_palette];
  
  export default final_color_palette;