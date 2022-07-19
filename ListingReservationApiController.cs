using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Cart;
using Sabio.Models.Domain.ListingReservations;
using Sabio.Models.Requests.ListingReservations;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ListingReservationApiController : BaseApiController
    {
        private IListingReservationService _listingReservationService = null;
        private IAuthenticationService<int> _authenticationService = null;
        public ListingReservationApiController(IListingReservationService service
            , ILogger<ListingReservationApiController> logger
            , IAuthenticationService<int> authenticationService) : base(logger)
        {
            _listingReservationService = service;
            _authenticationService = authenticationService;
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ListingReservation>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            
            try
            {
                ListingReservation listingRes = _listingReservationService.GetListingReservationById(id);

                if (listingRes == null)
                {
                    code = 404;
                    response = new ErrorResponse("Reservation Not Found");
                }
                else
                {
                    response = new ItemResponse<ListingReservation> { Item = listingRes };
                }
            }
            catch (Exception ex)
            {

                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
               
            }

            return StatusCode(code, response);

        }

        [HttpGet("checkout")]
        public ActionResult<ItemResponse<Cart>> GetById()
        {
            int code = 200;
            BaseResponse response = null; 

            try
            {
                int userId = _authenticationService.GetCurrentUserId();
                List<Cart> cartRes = _listingReservationService.GetCartByUserId(userId);
                
                if (cartRes == null)
                {
                    code = 404;
                    response = new ErrorResponse("Cart Reservation Not Found");
                }
                else
                {
                    response = new ItemsResponse<Cart> { Items = cartRes };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("search")]

        public ActionResult<ItemResponse<Paged<ListingReservation>>> SearchByCreatedBy(int pageIndex, int pageSize, int createdBy)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {

                Paged<ListingReservation> pages = _listingReservationService.GetByCreatedBy(pageIndex, pageSize, createdBy);

                if (pages == null)
                {
                    code = 404;
                    response = new ErrorResponse("Reservation Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<ListingReservation>> { Item = pages };
                }
            }
            catch (Exception ex)
            {
                code=500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code,response);

        }

        [HttpGet("paginate")]

        public ActionResult<ItemResponse<Paged<ListingReservation>>> GetAllPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {

                Paged<ListingReservation> pages = _listingReservationService.GetAll(pageIndex, pageSize);

                if (pages == null)
                {
                    code = 404;
                    response = new ErrorResponse("Reservation Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<ListingReservation>> { Item = pages };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);

        }

        [HttpPost]

        public ActionResult<ItemResponse<int>> Create(ListingReservationAddRequest model)
        {
            ObjectResult result = null;

            int userId = _authenticationService.GetCurrentUserId();

            try
            {

                int id = _listingReservationService.AddListingReservation(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);

            }
            return result;
        }

        [HttpPut("{id:int}")]

        public ActionResult<ItemResponse<int>> Update(ListingReservationUpdateRequest model)
        {


            int code = 200;
            BaseResponse response = null;

            int userId = _authenticationService.GetCurrentUserId();

            try
            {
                _listingReservationService.UpdateListingReservation(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);      

        }

        [HttpPut("status/{id:int}")]
        public ActionResult<SuccessResponse> Delete(StatusIdUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            int userId = _authenticationService.GetCurrentUserId();

            try
            {
                _listingReservationService.DeleteListingReservation(model,userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);

            }

            return StatusCode(code, response);
        }
    }
}
