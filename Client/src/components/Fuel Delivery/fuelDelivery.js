import React, { useState } from 'react'
import AddFuelDelivery from './addFuelDelivery';
import FuelDeliveryTable from './fuelDeliveryTable';

function FuelDelivery() {
  const [isChange, setIsChange] = useState(false);
  return (
    <div>
      <AddFuelDelivery setIsChange={setIsChange}/>
      <FuelDeliveryTable isChange={isChange}/>
    </div>
  )
}

export default FuelDelivery
