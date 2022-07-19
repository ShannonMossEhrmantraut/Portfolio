using Sabio.Models.Domain.Files;
using Sabio.Models.Domain.ListingReservations;
using Sabio.Models.Domain.Listings;
using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Sabio.Models.Domain.Cart
{
  public class Cart 
    {
        public int Id { get; set; }
        public Locations Location { get; set; }

        public string Title { get; set; }
        
        public int CostPerNight { get; set; }
        
        public int CostPerWeek { get; set; }

        public DateTime DateCheckIn { get; set; }

        public DateTime DateCheckOut { get; set; }
        
        public LookUp ReservationStatus { get; set; }

        public User User { get; set; }

        public List<ListingImageUrl> ListingUrls { get; set; }

    }
}
