import React from 'react';
import { Col, Table, Alert } from 'react-bootstrap';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const _logger = debug.extend('Cart Summary');

const CartSummary = (props) => {
    _logger('Cart Summary');

    const summary = props.summary || {};

    return (
        <>
            <div className="border p-3 mt-5 rounded">
                <h5 className="header-title mb-4 text-black text-center">Order Summary</h5>

                <Table responsive className="mb-0">
                    <tbody>
                        <tr>
                            <td className="text-black fw-semibold">Grand Total :</td>
                            <td className="text-black fw-semibold">${summary.grossTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="text-black fw-semibold">Discount : </td>
                            <td className="text-black fw-semibold">-${summary.discount.toFixed(2)}</td>
                        </tr>

                        <tr>
                            <td className="text-black fw-semibold">Estimated Tax : </td>
                            <td className="text-black fw-semibold">${summary.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th className="text-black fw-semibold">Total :</th>
                            <th className="text-black fw-semibold">${summary.netTotal.toFixed(2)}</th>
                        </tr>
                    </tbody>
                </Table>
                <Col className="text-sm-center mt-3">
                    <div className="text-sm-center mt-3">
                        <Link
                            to="/stripe/checkout"
                            className=" btn btn-sm btn-outline-dark d-none d-lg-inline-flex mt-1  dripicons-chevron-right">
                            Checkout {''}
                        </Link>
                    </div>
                </Col>
            </div>

            <Alert variant="success" className="mt-3">
                Use coupon code <strong>SWAP10</strong> and get a 10% discount !
            </Alert>

            <div className="input-group mt-3">
                <input
                    type="text"
                    className="form-control form-control-light"
                    placeholder="Coupon code"
                    aria-label="Recipient's username"
                />
                <div className="input-group-append">
                    <button className="btn btn-light" type="button">
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
};

CartSummary.propTypes = {
    summary: PropTypes.shape({
        grossTotal: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        tax: PropTypes.number.isRequired,
    }).isRequired,
};

export default CartSummary;
