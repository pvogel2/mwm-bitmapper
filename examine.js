var fs = require("fs"),
  PNG = require("pngjs").PNG;
 
fs.createReadStream("res/img/unrealIsland01.png")
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
 
        // invert color
        const v = this.data[idx] * 2;
        const vv = this.data[idx] * 2;
        this.data[idx] = v >= 255 ? 255: v;
        this.data[idx + 1] = v > 255 ? v - 255 : 0;
        if (v > 255) {
          //console.log(idx, vv, this.data[idx], this.data[idx+1], this.data[idx+2]);
        }
        this.data[idx + 2] = 0;//this.data[idx + 2] - 255;
 
        // and reduce opacity
        // this.data[idx + 3] = this.data[idx + 3] >> 1;
      }
    }
    console.log(
      this.data[Math.floor(this.data.length / 2)],
      this.data[Math.floor(this.data.length / 2) + 1],
      this.data[Math.floor(this.data.length / 2) + 2],
      this.data[Math.floor(this.data.length / 2) + 3],
      this.data[Math.floor(this.data.length / 2) + 4]
    );
    this.pack().pipe(fs.createWriteStream("out.png"));
  });