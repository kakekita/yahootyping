var sents = null;
var roms = null;

var word_r = null;
var typeStatus = {
  count1: 0,
  count2: null,
  pat: null,
  tmp: '',
  hist: '',
};

function getData() {
  var api_url =
    'https://script.google.com/macros/s/AKfycbyZe0sLk9whSFhUBcC5dRCuxVovLYkCVVXLHUACYQ8SqqLNj_BMdcbdRD6ROtTxaiEE/exec'; //生成したAPIのURLを指定
  fetch(api_url)
    .then(function (fetch_data) {
      return fetch_data.json();
    })
    .then(function (json) {
      sents = json;
      console.log(sents);
      console.log('取得完了');
      fetch('./roms.json')
        .then(response => response.json())
        .then(function (data) {
          roms = data;
          console.log(roms);
          getRomSentLists('にほんかいにじゃっぱーん');
          document.addEventListener('keydown', keydown_e);
        });
    });
}

function getRomSentLists(hiragana) {
  hiragana = String(hiragana);
  var h_sp = hiragana.split('');
  var s_rom = Array(h_sp.length);
  var r_keys = Object.keys(roms);
  console.log(r_keys);
  for (var h in h_sp) {
    if (r_keys.indexOf(h_sp[h]) != -1) {
      s_rom[h] = roms[h_sp[h]];
    } else {
      s_rom[h] = h_sp[h];
    }
  }

  for (var s = 0; s < s_rom.length - 1; s++) {
    var ch = String(h_sp[s]) + String(h_sp[s + 1]);
    switch(ch){
      case 'じゃ':
      case 'じゅ':
      case 'じょ':
        s_rom[s].push("j"+s_rom[s+1][0].replace(/xy|ly/,""))
        break;
    }
  }

  console.log(s_rom);

  word_r = s_rom;
  typeStatus.pat = Array(word_r.length).fill(0);
  typeStatus.count2 = Array(word_r.length).fill(0);
  typeStatus.count1 = 0;
  repaint();
}

function getNextKey() {
  var arr = [];
  for (var c in word_r[typeStatus.count1]) {
    if (word_r[typeStatus.count1][c].indexOf(typeStatus.tmp) != -1) {
      arr.push(word_r[typeStatus.count1][c].split('')[typeStatus.count2[typeStatus.count1]])
    }
  }

  return arr;
}

function keydown_e(e) {
  var key = e.key;
  for (var c in word_r[typeStatus.count1]) {
    if (
      key ===
        word_r[typeStatus.count1][c].split('')[
          typeStatus.count2[typeStatus.count1]
        ] &&
      word_r[typeStatus.count1][c].indexOf(typeStatus.tmp) != -1
    ) {
      typeStatus.pat[typeStatus.count1] = c;
      if (
        typeStatus.count2[typeStatus.count1] >=
        word_r[typeStatus.count1][c].split('').length - 1
      ) {
        //typeStatus.count2[typeStatus.count1]++;
        typeStatus.count1++;
        typeStatus.count2[typeStatus.count1] = 0;
        typeStatus.tmp = '';
      } else {
        typeStatus.count2[typeStatus.count1]++;
        typeStatus.tmp += key;
      }
      typeStatus.hist += key;
      console.log(typeStatus.hist);
      repaint();
      break;
    }
  }

  return false;
}

function repaint() {
  var all_t = '';
  var red_t = '';
  var black_t = '';

  for (var c in word_r) {
    /*if (c <= typeStatus.count1) {
      red_t += word_r[c][typeStatus.pat[typeStatus.count1]].slice(
        0,
        typeStatus.count2[c]
      );
    } else if (typeStatus.count1 == -1) {
      black_t += word_r[c][0].slice(0);
    } else {
      black_t += word_r[c][typeStatus.pat[typeStatus.count1]].slice(
        typeStatus.count2[c]
      );
    }*/
    all_t += word_r[c][typeStatus.pat[c]];
  }

  black_t = all_t.replace(typeStatus.hist, '');
  red_t = typeStatus.hist;

  document.getElementById('red-text').textContent = red_t;
  document.getElementById('black-text').textContent = black_t;
}

getData();
