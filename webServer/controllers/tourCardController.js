const TourCard = require('../models/tourCard');

const getAllTourCards = async (req, res) => {
  try {
    const tourCards = await TourCard.find({isHidden: false}, 'name code startPlace endPlaces price promoDiscount date time remainSlots numOfDays cardImgUrl');
    res.status(200).json(tourCards);
    // render cái gì tự bỏ vô đi
    res.render('tourSearch', {tourCards});
    //--------------------------------------
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const searchTourCards = async (req, res) => {
  try {
    const { startPlaceCode, endPlaceCode, numOfPeople, numOfDays, travelDate, minPrice, maxPrice } = req.query;
    const query = TourCard.find({isHidden: false}, 'name code startPlace endPlaces price promoDiscount date time remainSlots numOfDays cardImgUrl');
    
    if (startPlaceCode) {
      query.where('startPlace.code').equals(startPlaceCode);
    }

    if (endPlaceCode && endPlaceCode.length > 0) {
      query.where('endPlaces.code').in(endPlaceCode);
    }

    if (numOfPeople) {
      query.where('remainSlots').gte(numOfPeople);
    }

    if (travelDate) {
      query.where('date').equals(new Date(travelDate));
    }

    if (numOfDays) {
      query.where('numOfDays').equals(numOfDays);
    }

    if (minPrice && maxPrice) {
      query.where('price').gte(minPrice).lte(maxPrice);
    }

    const results = await query.exec();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTourCardByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const tourCard = await TourCard.findOne({ code }, 'name code startPlace endPlaces price promoDiscount date time remainSlots numOfDays cardImgUrl');
    if (!tourCard) {
      return res.status(404).json({ message: 'Tour card not found' });
    }
    res.status(200).json(tourCard);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRandom3TourCards = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const randomTourCards = await TourCard.aggregate([
      {
        $match: {
          date: { $gte: currentDate },
          isHidden: false,
        },
      },
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 0,
          name: 1,
          code: 1,
          startPlace: 1,
          endPlaces: 1,
          price: 1,
          promoDiscount: 1,
          date: 1,
          time: 1,
          remainSlots: 1,
          numOfDays: 1,
          cardImgUrl: 1,
        },
      },
    ]);

    res.status(200).json(randomTourCards);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  searchTourCards,
  getAllTourCards,
  getTourCardByCode,
  getRandom3TourCards
};
