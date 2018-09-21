var should = require('should');
var fs = require('fs');
var util = require('util');

var HTMLParser = require('../dist');

describe('Incorrect HTML Parser ', function () {

    var parseHTML = HTMLParser.parse;

    describe("Incorrect tag parser", function () {
        var htmlContent = fs.readFileSync(__dirname + '/html/search').toString();
        it('Mixed item must parse able', function () {
            var matchesTr = htmlContent.match(/<tr title.+?>[^tr]+<\/tr>/gs);
            var list_v_m = [];
            for (var i = 0; i < matchesTr.length; i++) {
                var tr = parseHTML(matchesTr[i]);
                var link = tr.querySelector('td a.musictitle');
                var songItem = {};
                if (link) {
                    var thumb_search = tr.querySelector('img[src^="http://data.chiasenhac.com/data/"]');
                    var quality_finder = tr.querySelector('span.gen span[style^="color:"]');
                    let quality = 'Unknow';
                    if (!quality_finder) {
                        var regex = /\d{2,3}kbps|HD\s\d+p|MV\s\d+p/i;
                        var matcher = tr.querySelector('span.gen').text.match(regex);
                        if (matcher) {
                            quality = matcher[0];
                        }
                    } else {
                        quality = quality_finder.text;
                    }
                    songItem.id = link.attributes['href'];
                    songItem.href = link.attributes['href'];
                    songItem.title = link.text;
                    songItem.type = songItem.href.indexOf('/hd/video/') > -1 ? 'video' : 'audio';
                    songItem.artist = tr.querySelectorAll('.tenbh p')[1].text;
                    songItem.duration = tr.querySelector('span.gen').text.replace(quality, '').trim();
                    songItem.quality = quality;
                    songItem.thumb = thumb_search ? thumb_search.attributes['src'] : '';
                } else {
                    continue;
                }
                list_v_m.push(songItem);
            }
            list_v_m.length.should.eql(25);
        });
        it('Album item must be parser correct', function () {
            var list_album = [];
            var matchesTrAlbum = htmlContent.match(/<tr class.+?>[^tr]+<\/tr>/gs);
            var table_thumb = parseHTML(matchesTrAlbum[0]).querySelectorAll('td');
            var table_info = parseHTML(matchesTrAlbum[1]).querySelectorAll('td');
            for (let j = 0; j < table_thumb.length; j++) {
                var full_text = table_info[j].querySelector('.gen').text;
                var regex = /\((\d+)\)/;
                let year = 'Unknow';
                var matcher = full_text.match(regex);
                if (matcher) {
                    year = matcher[1];
                }
                var link = table_info[j].querySelector('.gen a.musictitle');
                var quality = table_info[j].querySelector('.gen span').text;
                var albumTd = {};
                albumTd.id = link.attributes['href'];
                albumTd.href = link.attributes['href'];
                albumTd.title = link.text;
                var thumb = table_thumb[j].querySelector('.genmed a img');
                albumTd.thumb = thumb ? thumb.attributes['src'] : '';
                albumTd.year = year;
                albumTd.artist = full_text.replace('(' + year + ')', '').replace(link.text, '').replace(quality, '').trim();
                albumTd.quality = quality;
                list_album.push(albumTd);
            }
            list_album.length.should.eql(3);
        });
        it('[Album search mode] Album item must be parser correct', function () {
            var htmlContentAlbum = fs.readFileSync(__dirname + '/html/search-album').toString();
            var list_album = [];
            var list_tr = htmlContentAlbum.match(/<tr class.+?>[^tr]+<\/tr>/gs);
            for (let i = 0; i <= list_tr.length - 2; i += 2) {
                var table_thumb = parseHTML(list_tr[i]).querySelectorAll('td');
                var table_info = parseHTML(list_tr[i + 1]).querySelectorAll('td');
                for (let j = 0; j < table_thumb.length; j++) {
                    var full_text = table_info[j].querySelector('.gen').text;
                    var regex = /\((\d+)\)/;
                    var year = 'Unknow';
                    var matcher = full_text.match(regex);
                    if (matcher) {
                        year = matcher[1];
                    }
                    var link = table_info[j].querySelector('.gen a.musictitle');
                    var quality = table_info[j].querySelector('.gen span').text;
                    var albumTd = {};
                    albumTd.id = link.attributes['href'];
                    albumTd.href = link.attributes['href'];
                    albumTd.title = link.text;
                    var thumb = table_thumb[j].querySelector('.genmed a img');
                    albumTd.thumb = thumb ? thumb.attributes['src'] : '';
                    albumTd.year = year;
                    albumTd.artist = full_text.replace('(' + year + ')', '').replace(link.text, '').replace(quality, '').replace('(Xem chi tiết...)', '').trim();
                    albumTd.quality = quality;
                    list_album.push(albumTd);
                }
            }
            list_album.length.should.eql(24);
            var searchObject = {};
            var doc = parseHTML(htmlContentAlbum);
            var pageA = doc.querySelector('.xt');
            if (pageA) {
                var href = pageA.attributes['href'];
                var regexPage = /\&page=(\d+)/;
                var regexStart = /\&start=(\d+)/;
                var matcherPage = href.match(regexPage);
                if (matcherPage) {
                    searchObject.next_page = parseInt(matcherPage[1]);
                }
                var matcherStart = href.match(regexStart);
                if (matcherStart) {
                    searchObject.next_page_start = parseInt(matcherStart[1]);
                }
            }
            searchObject.next_page.should.eql(2);
            searchObject.next_page_start.should.eql(128);
        })
    });
});