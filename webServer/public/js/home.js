

// Hàm chuyển ngày thành chuỗi theo định dạng "dd/mm/yyyy"
function changeDateToString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Chuyển số thành chuỗi và ngược lại
function formatNumberWithCommas(number) {
    const numString = String(number);
    return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
  
  // Hàm tạo mã HTML cho từng tour
  function makeCardTour(cardTour) {
    return `
      <div class="col-sm-4 d-flex mb-3">
        <div class="card m-auto h-100" style="width: 380px;">
            <img src="${cardTour.cardImgUrl}" class="card-img-top card-img" alt="..." />
            <div class="card-body">
                <div class="card-title">
                    <p class="mb-0">${changeDateToString(new Date(cardTour.date))} - ${cardTour.numOfDays}N${cardTour.numOfDays-1}Đ - Giờ đi: ${cardTour.time}</p>
                </div>
                <div class="card-text">
                    <a class="card-text__link" data-value="${cardTour.code}" href="/tours/${cardTour.code}">${cardTour.name}</a>
                </div>
                <div class="d-flex mt-4 justify-content-between card-price-container">
                    <div class="card-price">
                      ${formatNumberWithCommas(cardTour.price)} đ
                    </div>
                    <a class="card-text__link" data-value="${cardTour.code}" href="/tours/${cardTour.code}">
                        <button class="blue-button btn-card mt-0" data-value ="${cardTour.code}">XEM THÊM</button>
                    </a>
                </div>
            </div>
        </div>
      </div>
    `;
  }
  
  // Hàm hiển thị danh sách các tour xuất sắc
  function displayOutstandingTour(tourCards) {
    const outStandingContainer = document.getElementById('tour-container');
    outStandingContainer.innerHTML = "";
  
    tourCards.forEach(tour => {
      const cardTour = makeCardTour(tour);
      outStandingContainer.insertAdjacentHTML('beforeend', cardTour);
    });
  }
  
  // Hàm gọi API để lấy danh sách các tour ngẫu nhiên và hiển thị lên trang web
  async function getRandomTour() {
    try {
      const response = await axios.get('/tourCards/randomTourCards');
  
      if (response.status === 200) {
        const tourCards = response.data;
        displayOutstandingTour(tourCards);
      } else {
        throw new Error('Lỗi khi gửi yêu cầu đến API');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error.message);
    }
  }
    
  getRandomTour();
  getAllProvince() 

  async function getAllProvince() {
    try {
      const response = await axios.get('/provinces');
  
      if (response.status === 200) {
        const provinces = response.data;
        displayProvinces(provinces);
      } else {
        throw new Error('Lỗi khi gửi yêu cầu đến API');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error.message);
    }
  }

  
  function displayProvinces(provinces)
  {
      startPoint.innerHTML ="";
      endPoint.innerHTML ="";

      const chooseStartPoint = '<option class="form-option" value = "">Hãy chọn điểm đi</option>';
      const chooseEndPoint = '<option class="form-option" value ="">Hãy chọn điểm đến</option>';

      startPoint.insertAdjacentHTML('beforeend', chooseStartPoint);
      endPoint.insertAdjacentHTML('beforeend', chooseEndPoint);

      provinces.forEach(province => {
        const provinceSelection = makeProvinceSelection(province);
        startPoint.insertAdjacentHTML('beforeend', provinceSelection);
        endPoint.insertAdjacentHTML('beforeend', provinceSelection);
      });
  }

  function makeProvinceSelection(province)
  {
      return `
        <option class="form-option" value="${province.code}">${province.name}</option>
      `
  }

  // Search Tour
  const endPoint = document.getElementById('endPoint');
  const startPoint = document.getElementById('startPoint');
  const searchTravelDate = document.getElementById('search_travel-date');
  const searchNumOfDate = document.getElementById('search_num-of-date');
  function searchTour() {
      // console.log(startPoint.value);
      window.location.href = `/tourCards/search/?startPlaceCode=${startPoint.value}&endPlaceCode=${endPoint.value}&travelDate=${searchTravelDate.value}&numOfDays=${searchNumOfDate.value}`
  }