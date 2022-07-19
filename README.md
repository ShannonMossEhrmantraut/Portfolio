# Portfolio
I was responsible for multiple components while working on a freelance project with a company called Kommu. 

Kommu is an upcoming residence exchange network, where users can register and swap houses with other verified users, enabling affordable lodging during any of their travels.

The first component I worked with in React.js was the Reservation Form. This component renders a listing selected on a previous page with multiple listings (houses) a user can select to reserve. The reservation form utilized the useLocation react hook to pass state from the listings component. The features rendered on the UI for the Reservation Form are the Image, Title, Services available at the location and Prices. There is also an input field featuring a calendar to select the dates for the users stay. 

Once the user has selected the dates, there is an 'Add to Cart' button which features an AJAX call to add the selected dates and listing to the checkout page.

Once the 'Add to Cart' button is selected the user is directed to the checkout page where two components are rendered on the UI. The first component is the Cart.jsx page that renders a table with the listing information, total days (calculated from the dates previously selected), cost per night and total amount (calculated by the totalDays * costPerNight). This information is rendered from an API call to the database that only shows reservations added to the cart by the currently logged in user. Also, in the return statement there is a mapper used to render multiple listings if the user has selected several to reserve. 
