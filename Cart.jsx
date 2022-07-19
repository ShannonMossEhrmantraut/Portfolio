import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import debug from 'sabio-debug';
import CartSummary from '../checkoutpage/CartSummary';
import * as reservationService from '../../services/reservationService';
import '../../assets/scss/custom/plugins/icons/_dripicons.scss';
import '../../assets/scss/custom/plugins/icons/_materialdesignicons.scss';
import { toast } from 'react-toastify';

const _logger = debug.extend('Cart');

const Cart = () => {
    const { state, listingResInfo, locationData, totalDays } = useLocation();

    const navigate = useNavigate();

    const [items, setItems] = useState([]);

    const [summary, setSummary] = useState({
        grossTotal: 0,
        discount: 0,
        tax: 0,
        netTotal: 0,
    });

    useEffect(() => {
        _logger('STATE =>', state);
        reservationService.getCartByUserId().then(getByIdSuccess).catch(getByIdError);
        _logger('Cart By Id =>');
    }, []);

    const getDayDifference = (inputStartDate, inputEndDate) => {
        let startDate = new Date(inputStartDate);
        let endDate = new Date(inputEndDate);
        let totalDays = (endDate.getTime() - startDate.getTime()) / 86400000;
        return totalDays;
    };

    const getByIdSuccess = (response) => {
        _logger('ON success =>', response.items);

        var reservations = response.items;
        toast.success('Listing Added to Cart');

        var grossTotal = 0;
        reservations.map((r) => {
            let totalDays = getDayDifference(r.dateCheckIn, r.dateCheckOut);
            grossTotal += totalDays * r.costPerNight;
            return null;
        });

        setSummary({
            grossTotal: grossTotal,
            discount: 0,
            tax: grossTotal * 0.1,
            netTotal: grossTotal + grossTotal * 0.1,
        });
        setItems((prevState) => {
            let newState = { ...prevState };
            newState = response.items;
            return newState;
        });
    };

    const getByIdError = (err) => {
        _logger(err);
    };

    const removeItem = (e, item) => {
        e.preventDefault();
        var localItems = items.filter((i) => i.id !== item.listingId);
        _adjustCart(localItems);
    };

    const _adjustCart = (localItems) => {
        var newGrossTotal = summary.grossTotal;

        for (const item of localItems) {
            newGrossTotal += item.total;
        }
        let taxCount = (newGrossTotal * 1) / 10;

        var newNetTotal = summary.netTotal + taxCount;
        setItems(localItems);
        setSummary({
            ...summary,
            grossTotal: newGrossTotal,
            netTotal: newNetTotal,
            tax: taxCount,
        });
    };

    const onChangeReservationClick = (e) => {
        var listingId = e.target.value;
        _logger('change reserv clicked', listingId);
        const stateTransfer = { type: 'confirmType', payload: state, listingResInfo, locationData, totalDays };

        navigate(`/reservationform/${listingId}`, {
            state: { stateTransfer },
        });
    };

    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <Card.Body style={{ padding: '3rem 5rem' }}>
                            <Row>
                                <Col>
                                    <div className="p-4">
                                        <Table
                                            responsive
                                            borderless
                                            className="table-sm-centered table-nowrap mt-4 w-100 h-200 align-middle">
                                            <thead className="table-success">
                                                <tr>
                                                    <th className="text-decoration-underline text-center text-black">
                                                        Swapper Listing
                                                    </th>
                                                    <th className="text-decoration-underline text-black">Total Days</th>
                                                    <th className="text-decoration-underline text-black">
                                                        Cost Per Night
                                                    </th>
                                                    <th className="text-decoration-underline text-black">Total</th>
                                                    <th className="text-decoration-underline text-black">Remove</th>
                                                    <th style={{ width: '50px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td>
                                                                <img
                                                                    src={item.listingUrls[0].url}
                                                                    alt="house"
                                                                    title="contact-img"
                                                                    className="rounded me-3"
                                                                    height="100"></img>
                                                                <p className="m-0 d-inline-block align-middle font-16">
                                                                    <Link
                                                                        to="#"
                                                                        className="fw-bold text-black text-uppercase">
                                                                        {item.title}
                                                                    </Link>
                                                                    <br />

                                                                    <small className="fw-bold text-black">
                                                                        <b>Address:</b> {item.location.lineOne}
                                                                    </small>
                                                                    <br />

                                                                    <button
                                                                        type="button"
                                                                        value={item.id}
                                                                        className="btn btn-sm btn-outline-dark d-none d-lg-inline-flex mt-1 float-start"
                                                                        onClick={onChangeReservationClick}>
                                                                        <i className="dripicons-chevron-left"></i>{' '}
                                                                        Change Swap{' '}
                                                                    </button>
                                                                </p>
                                                            </td>

                                                            <td className="fw-bold text-black" style={{ padding: 40 }}>
                                                                {getDayDifference(item.dateCheckIn, item.dateCheckOut)}
                                                            </td>
                                                            <td className="fw-bold text-black" style={{ padding: 40 }}>
                                                                ${item.costPerNight}
                                                            </td>
                                                            <td className="fw-bold text-black">
                                                                $
                                                                {getDayDifference(item.dateCheckIn, item.dateCheckOut) <
                                                                0
                                                                    ? 0
                                                                    : item.costPerNight *
                                                                      getDayDifference(
                                                                          item.dateCheckIn,
                                                                          item.dateCheckOut
                                                                      )}
                                                            </td>
                                                            <td className="fw-bold text-black">
                                                                <Link
                                                                    to="#"
                                                                    className="action-icon text-black"
                                                                    onClick={(e) => {
                                                                        removeItem(e, item);
                                                                    }}>
                                                                    <i
                                                                        className="dripicons-trash"
                                                                        style={{ padding: '60%' }}></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>

                                        <div className="mt-3 text-black">
                                            <label className="form-label" htmlFor="example-textarea">
                                                Add a Note:
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="example-textarea"
                                                rows="3"
                                                placeholder="Write some note.."></textarea>
                                        </div>
                                    </div>
                                </Col>

                                <Col lg={4}>
                                    <CartSummary summary={summary} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Cart;
