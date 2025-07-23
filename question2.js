// Question 2

// Base Vehicle class
class Vehicle {
	constructor(make, model, wheels, length, weight, maxPassengers) {
		this.make = make;
		this.model = model;
		this.wheels = wheels;
		this.length = length;
		this.weight = weight;
		this.maxPassengers = maxPassengers;
	}

	// Get vehicle type for parking logic
	getVehicleType() {
		return this.constructor.name;
	}

	// Check if vehicle can park in garage (cars and motorcycles only)
	canParkInGarage() {
		return (
			this.getVehicleType() === 'Car' ||
			this.getVehicleType() === 'Motorcycle'
		);
	}

	// Check if vehicle is compact (weight < 1500)
	isCompact() {
		return this.weight < 1500;
	}
}

// extend base class for each type of vehicle
class Car extends Vehicle {
	constructor(make, model, length, weight, maxPassengers) {
		super(make, model, 4, length, weight, maxPassengers);
	}
}

class Motorcycle extends Vehicle {
	constructor(make, model, length, weight, maxPassengers) {
		super(make, model, 2, length, weight, maxPassengers);
	}
}

class Bus extends Vehicle {
	constructor(make, model, length, weight, maxPassengers) {
		super(make, model, 6, length, weight, maxPassengers);
	}
}

// Base Parking Facility class
class ParkingFacility {
	constructor(name, totalSpaces) {
		this.name = name;
		this.totalSpaces = totalSpaces;
		this.occupiedSpaces = 0;
		this.parkedVehicles = [];
	}

	// Check if facility has available space
	hasAvailableSpace() {
		return this.occupiedSpaces < this.totalSpaces;
	}

	// Park a vehicle (to be implemented by subclasses)
	parkVehicle(vehicle) {
		throw new Error('parkVehicle method must be implemented by subclass');
	}

	// Remove a vehicle
	removeVehicle(vehicle) {
		const index = this.parkedVehicles.indexOf(vehicle);
		if (index > -1) {
			this.parkedVehicles.splice(index, 1);
			this.occupiedSpaces--;
			return true;
		}
		return false;
	}

	// Get parking status
	getStatus() {
		return {
			name: this.name,
			totalSpaces: this.totalSpaces,
			occupiedSpaces: this.occupiedSpaces,
			availableSpaces: this.totalSpaces - this.occupiedSpaces,
			parkedVehicles: this.parkedVehicles.map(
				(v) => `${v.make} ${v.model}`
			),
		};
	}
}

// Parking Lot
// any type of vehicle
class ParkingLot extends ParkingFacility {
	constructor(name, totalSpaces) {
		super(name, totalSpaces);
	}

	parkVehicle(vehicle) {
		if (!this.hasAvailableSpace()) {
			return false;
		}

		// Parking lots accept all vehicle types
		this.parkedVehicles.push(vehicle);
		this.occupiedSpaces++;
		return true;
	}
}

// Parking Garage
// only cars and motorcycles
// also has compact spaces (weight < 1500)
class ParkingGarage extends ParkingFacility {
	constructor(name, normalSpaces, compactSpaces) {
		super(name, normalSpaces + compactSpaces);
		this.normalSpaces = normalSpaces;
		this.compactSpaces = compactSpaces;
		this.occupiedNormalSpaces = 0;
		this.occupiedCompactSpaces = 0;
	}

	parkVehicle(vehicle) {
		// Check if vehicle type is allowed in garage
		if (!vehicle.canParkInGarage()) {
			return false; // Buses not allowed in garage
		}

		// Try to park in compact space first if vehicle is compact
		if (
			vehicle.isCompact() &&
			this.occupiedCompactSpaces < this.compactSpaces
		) {
			this.parkedVehicles.push(vehicle);
			this.occupiedCompactSpaces++;
			this.occupiedSpaces++;
			return true;
		}

		// Try to park in normal space
		if (this.occupiedNormalSpaces < this.normalSpaces) {
			this.parkedVehicles.push(vehicle);
			this.occupiedNormalSpaces++;
			this.occupiedSpaces++;
			return true;
		}

		return false; // No space available
	}

	// Override getStatus to include compact/normal space details
	getStatus() {
		const baseStatus = super.getStatus();
		return {
			...baseStatus,
			normalSpaces: {
				total: this.normalSpaces,
				occupied: this.occupiedNormalSpaces,
				available: this.normalSpaces - this.occupiedNormalSpaces,
			},
			compactSpaces: {
				total: this.compactSpaces,
				occupied: this.occupiedCompactSpaces,
				available: this.compactSpaces - this.occupiedCompactSpaces,
			},
		};
	}
}

// Example usage and testing
function testParkingSystem() {
	// Create vehicles
	const car1 = new Car('Mazda', 'Miata', 15, 1200, 5);
	const car2 = new Car('Ford', 'F-9000 Super Duty', 18, 6900, 6);
	const motorcycle = new Motorcycle('Kawasaki', 'Ninja', 8, 400, 2);
	const bus = new Bus('Yellow', 'School Bus 3000', 40, 15000, 50);

	// Create parking facilities
	const parkingLot = new ParkingLot('Walmart Parking Lot', 100);
	const parkingGarage = new ParkingGarage('Generic Garage', 50, 20);

	// Test parking scenarios
	console.log('1. Parking miata in garage (should use compact space):');
	console.log(parkingGarage.parkVehicle(car1) ? 'Success' : 'Failed');
	console.log(parkingGarage.getStatus());

	console.log('\n2. Parking truck in garage (should use normal space):');
	console.log(parkingGarage.parkVehicle(car2) ? 'Success' : 'Failed');
	console.log(parkingGarage.getStatus());

	console.log('\n3. Parking motorcycle in garage:');
	console.log(parkingGarage.parkVehicle(motorcycle) ? 'Success' : 'Failed');
	console.log(parkingGarage.getStatus());

	console.log('\n4. Parking bus in garage (should fail):');
	console.log(parkingGarage.parkVehicle(bus) ? 'Success' : 'Failed');
    console.log(parkingGarage.getStatus());

	console.log('\n5. Parking bus in parking lot (should succeed):');
	console.log(parkingLot.parkVehicle(bus) ? 'Success' : 'Failed');
	console.log(parkingLot.getStatus());
}

// Run the test
testParkingSystem();
