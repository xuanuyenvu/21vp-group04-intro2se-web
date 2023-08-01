const Tour = require('../models/tour');
const User = require('../models/user');

const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const createTour = async (req, res) => {
    try {
        const tourData = req.body;
        const newTour = new Tour(tourData);
        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tour' });
    }
};

const deleteTour = async (req, res) => {
    try {
        const code = req.params.code;
        const deletedTour = await Tour.findOneAndDelete({ code });
        
        if (deletedTour) {
            res.status(200).json({ message: 'Tour deleted successfully' });
        } else {
            res.status(404).json({ error: 'Tour not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tour' });
    }
};

const searchTours = async (req, res) => {
    try {
      const {
        startPlaceCode,
        endPlaceCode,
        numOfPeople,
        numOfDays,
        travelDate,
        minPrice,
        maxPrice,
      } = req.query;
  
      const query = Tour.find();
  
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
  
const getTourByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const user = await User.findById(req.userId).select('fullName email dateOfBirth');
        const tour = await Tour.findOne({ code });
        if (!tour) {
          return res.status(404).json({ message: 'Tour not found' });
        }
        console.log(tour);
        res.render('tourInfo',{tour, user});
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
};


module.exports = {
    getAllTours,
    createTour,
    deleteTour,
    getTourByCode,
    searchTours
};
  