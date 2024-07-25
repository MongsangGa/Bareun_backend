const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");


/**
 * @param n 1: 하이런, 2: 사랑의 달팽이 
 * @param page 페이지 번호
 */
const getPage = (n, page) => {
    return n == 1 
        ? `https://www.hilearn.or.kr/lecture/list.nx?SC_SC1_CODE=&SC_SC2_CODE=&SC_ORDER=A&SC_WORD=&PAGE=${ page }&`
        : `https://www.soree119.com/%EC%82%AC%EB%9E%91%EC%9D%98-%EB%8B%AC%ED%8C%BD%EC%9D%B4/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/?pageid=${ page }&mod=list`;
}

const doCrawlingHiLearn = async () => {
    try {
        let isAvailable = true; // 페이지 유효성
        let list = [];

        for (let page = 1; page < 35; page++) {
            const html = await axios.get(getPage(1, page));
            const $ = cheerio.load(html.data);

            const bodyList = $("ul.learn_lst1 li");

            bodyList.map((i, element) => {
                list[i] = {
                    title: $(element).find("a div.txt_wrap p.tit").text().replace(/\s/g, "").replace(':', ''),
                    name:  $(element).find("a div.txt_wrap p.name").text().replace(/\s/g, ""),
                    img:   'https://www.hilearn.or.kr/' + $(element).find("a div.img_wrap1 div.img_wrap2 img").attr('src').replace(/\s/g, "").replace('../', ''),
                    url:   'https://www.hilearn.or.kr/lecture/' + $(element).find("a").attr('href').replace(/\s/g, ""),
                };
                
                let isExist = fs.existsSync('./imgs/' + list[i].title + '.jpg'); 
                
                if (!isExist && false) {
                    axios({
                        url: list[i].img,
                        responseType: 'stream',
                    }).then((response) => {
                        response.data.pipe(fs.createWriteStream('./imgs/' + list[i].title + '.jpg'))
                            .on('finish', () => {
                                console.log('이미지 다운로드 완료');
                            })
                            .on('error', (err) => {
                                console.error('이미지 다운로드 실패:', err);
                            });
                    })
                    .catch((err) => {
                        console.error('이미지 다운로드(URL 호출) 실패:', err);
                    });
                }   
            });
            console.log(list)
        } 

        
    
    } catch (error) {
        console.log(error);
    }
}


/**
 * 사랑의 달팽이 크롤링
 */
const doCrawlingSorae119 = async () => {
    try {
        let isAvailable = true; // 페이지 유효성
        let page = 1;

        do {
            const html = await axios.get(getPage(2, page));
            const $ = cheerio.load(html.data);
            
            let list = [];
            const bodyList = $("div.kboard-list table tbody tr");

            bodyList.map((i, element) => {

                // 공지사항이 아닌 내용만 가져온다.
                if ($(element).find("td.kboard-list-uid").text().replace(/\s/g, "").replace(':', '') != '공지사항') {
                    
                    // 마지막 페이지인지 판단
                    if ($(element).find("td.kboard-list-uid").text().replace(/\s/g, "").replace(':', '') == '1') {
                        isAvailable = false;
                    }
                    
                    list.push({
                        postID    : $(element).find("td.kboard-list-uid").text().replace(/\s/g, ""), 
                        title     : $(element).find("td.kboard-list-title a").text().replace(/\s/g, ""), 
                        url       : 'https://www.soree119.com/' + $(element).find("td.kboard-list-title a").attr('href').replace(/\s/g, ""), 
                        uploadDate: $(element).find("td.kboard-list-date").text().replace(/\s/g, "")
                    });
                }
            });

            console.log(list)
            page++;

        } while (isAvailable); 

    } catch (error) {
        console.log(error);
    }
}

doCrawlingSorae119();
