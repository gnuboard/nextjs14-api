const axios = require('axios');

const getCoordinates = async (address) => {
  const clientId = 'kxkyoo2wca'; // 네이버 클라우드 플랫폼에서 발급받은 Client ID
  const clientSecret = 'U0RaQDwwD00QFoXkFmrh7JTZLC1OxyZIE2mqZHuI'; // 네이버 클라우드 플랫폼에서 발급받은 Client Secret

  try {
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode', {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
      params: {
        query: address,
      },
    });

    const data = response.data;
    if (data.addresses.length > 0) {
      const { x, y } = data.addresses[0]; // x: 경도, y: 위도
      console.log(`위도: ${y}, 경도: ${x}`);
      return { latitude: y, longitude: x };
    } else {
      console.error('주소를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('에러 발생:', error);
  }
};

getCoordinates('서울특별시 강남구 테헤란로 322');

// 실행
// node getCoordinates.js


// 위도(latitude): 37.5032509, 
// 경도(longitude): 127.0465880
