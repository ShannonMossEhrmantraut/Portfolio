import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import * as reservationService from '../services/reservationService';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import debug from 'sabio-debug';
import * as listingService from '../services/listingService';
import locationService from '../services/locationService';
import { Card, Row, Col } from 'react-bootstrap';
import { BsCart } from 'react-icons/bs';

const _logger = debug.extend('Reservations');

function ReservationForm() {
    const { state } = useLocation();

    const navigate = useNavigate();

    const { listingId } = useParams();

    const [listingResInfo, setListingResInfo] = useState({
        listingId: listingId,
        dateCheckIn: new Date(),
        dateCheckOut: new Date(),
        statusId: 1,
    });

    const [totalDays, setTotalDays] = useState(1);

    const [perWeek, setPerWeek] = useState({ cost: 0 });

    const [listingData, setListingData] = useState();

    const [locationData, updateLocationData] = useState({});

    useEffect(() => {
        setTotalDays(() => {
            let total =
                new Date(listingResInfo.dateCheckOut).getTime() - new Date(listingResInfo.dateCheckIn).getTime();
            total = total / 86400000;
            return Math.floor(total);
        });
        _logger(totalDays);
    }, [listingResInfo.dateCheckIn, listingResInfo.dateCheckOut]);

    useEffect(() => {
        if (state?.type === 'reservationType' && state?.payload) {
            const updatelistingInfo = state.payload;
            _logger(updatelistingInfo);
            setListingData((prevState) => {
                let pd = { ...prevState };
                pd = updatelistingInfo;
                return pd;
            });
            setPerWeek((prevState) => {
                const weeklycost = { ...prevState };
                weeklycost.cost = state.payload.costPerNight * 7;
                return weeklycost;
            });
        } else if (state?.stateTransfer?.type === 'confirmType' && state?.stateTransfer?.payload) {
            const updatelistingInfo = state.stateTransfer.payload.payload.payload;
            _logger(updatelistingInfo);
            setListingData((prevState) => {
                let pd = { ...prevState };
                pd = updatelistingInfo;
                return pd;
            });
            setPerWeek((prevState) => {
                const weeklycost = { ...prevState };
                weeklycost.cost = state.stateTransfer.payload.payload.payload.costPerNight * 7;
                return weeklycost;
            });
        } else {
            reservationService.getListingResById(listingId).then(getByIdSuccess).catch(getByIdError);
        }

        listingService.getById(listingResInfo.listingId).then(onGetListingSuccess);
        _logger(locationData);
        _logger(listingResInfo.listingId);
        _logger({ listingId });
        _logger({ state }, 'payload');
    }, []);

    const onGetListingSuccess = (data) => {
        const targetId = data.data.item.locationId;
        _logger(targetId);

        locationService.getByListingId(targetId).then(onGetLocationSuccess);
        return data;
    };

    const onGetLocationSuccess = (data) => {
        const result = data.data.item;

        updateLocationData(() => {
            const updatedLocation = result;
            return updatedLocation;
        });
    };

    const dateUpdater = (e) => {
        _logger(e);
        const name = e.target.name;
        const value = e.target.value;
        setListingResInfo((prevState) => {
            const newState = { ...prevState };
            newState[name] = value;
            return newState;
        });
    };

    const getByIdSuccess = (response) => {
        _logger(response.item);
        let listingObj = response.item.listing;
        setListingData((prevState) => {
            const pd = { ...prevState };
            pd.bathroom = listingObj.baths;
            pd.bedrooms = listingObj.bedRooms;
            pd.guest = listingObj.guestCapacity;
            return pd;
        });
    };

    const getByIdError = (err) => {
        _logger(err);
    };

    const onClickSwap = () => {
        reservationService
            .addListingToCart({ ...listingResInfo })
            .then(onAddSuccess)
            .catch(onAddError);
    };

    const onAddSuccess = (response) => {
        const info = response.item;
        _logger({ infos: info });

        const stateTransfer = { type: 'cartType', payload: state, listingResInfo, locationData, totalDays };
        _logger(stateTransfer);
        navigate(`/checkout`, { state: stateTransfer });
    };
    const onAddError = (err) => {
        _logger(err);
    };
    const onClickViewListings = (e) => {
        e.preventDefault();
        _logger('View Listings clicked');
        navigate(-2);
    };

    const onCartClick = (e) => {
        e.preventDefault();
        _logger('cart btn clicked');

        const stateTransfer = { type: 'cartType', payload: state, listingResInfo, locationData, totalDays };
        _logger(stateTransfer);
        navigate(`/checkout`, { state: stateTransfer });
    };

    return (
        <React.Fragment>
            <div className="float-end translate-middle mx-4 bottom-25 start-50">
                {' '}
                <button
                    type="button"
                    className="mx-3 btn btn-sm btn-outline-dark d-none d-lg-inline-flex mt-1"
                    onClick={onCartClick}
                    style={{ width: '90 px' }}>
                    <BsCart />
                </button>
            </div>
            <div className="col-6 row-1 card container  position-abosolute">
                <div className="">
                    <Card className="shadow-lg border rounded bg-light mt-2 ">
                        <Card.Img
                            src={listingData?.images[0]}
                            style={{ height: 400 }}
                            className="rounded card-img-top mt-2 img-fluid "
                        />
                        <Card.Body>
                            <Card.Title as="h4" className=" text-center text-black mb-2" style={{ fontSize: 25 }}>
                                {listingData?.title}
                            </Card.Title>
                            <Card.Title>
                                <h4
                                    className="text-center text-black text-decoration-underline mt-2"
                                    style={{ fontSize: 20 }}>
                                    Services
                                </h4>
                                <p className="mb-1 text-center text-black ">{listingData?.services[0]?.name}</p>
                                <p className="mb-1 text-center text-black ">{listingData?.services[1]?.name}</p>
                                <p className="mb-1 text-center text-black ">{listingData?.services[2]?.name}</p>
                            </Card.Title>

                            <Card.Title>
                                <h4
                                    className="text-center text-black  text-decoration-underline mt-2"
                                    style={{ fontSize: 20 }}>
                                    Prices
                                </h4>
                                <p className="mb-1 text-center text-black ">${listingData?.costPerNight} / Night</p>
                                <p className="mb-3 text-center text-black ">${perWeek.cost} / Week</p>
                            </Card.Title>
                            <Card.Title>
                                <p className="text-center text-black float-start mb-3 mx-5">
                                    <label className="text-center text-black">Check-In Date</label> <br />
                                    <input name="dateCheckIn" type="date" onChange={dateUpdater}></input>
                                </p>
                                <p className="text-center text-black float-end mb-3 mx-5">
                                    <label>Check-Out Date</label> <br />
                                    <input name="dateCheckOut" type="date" onChange={dateUpdater}></input>
                                </p>
                            </Card.Title>
                        </Card.Body>

                        <Row className="mb-3 mx-1 mx-5">
                            <Col>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-dark d-none d-lg-inline-flex mt-1 float-start mx-3"
                                    onClick={onClickViewListings}
                                    style={{ width: '90 px' }}>
                                    View Listings
                                </button>
                            </Col>
                            <Col>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-dark d-none d-lg-inline-flex mt-1 float-end mx-3"
                                    onClick={onClickSwap}
                                    style={{ width: '90 px' }}>
                                    Add To Cart
                                </button>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ReservationForm;
