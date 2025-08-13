import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CABS } from "../../graphql/queries";
import {
  ADD_CAB_MUTATION,
  UPDATE_CAB_MUTATION,
  DELETE_CAB_MUTATION,
} from "../../graphql/mutations";
import {
  Car,
  Plus,
  Edit,
  Trash2,
  Phone,
  Users,
  DollarSign,
} from "lucide-react";

const CabManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCab, setEditingCab] = useState(null);
  const [formData, setFormData] = useState({
    driverName: "",
    carModel: "",
    licensePlate: "",
    capacity: "",
    pricePerKm: "",
    location: "",
    driverPhone: "",
  });

  const { data, loading, error, refetch } = useQuery(GET_CABS);

  const [addCab, { loading: addLoading }] = useMutation(ADD_CAB_MUTATION, {
    onCompleted: () => {
      resetForm();
      refetch();
    },
  });

  const [updateCab, { loading: updateLoading }] = useMutation(
    UPDATE_CAB_MUTATION,
    {
      onCompleted: () => {
        resetForm();
        refetch();
      },
    }
  );

  const [deleteCab] = useMutation(DELETE_CAB_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      driverName: "",
      carModel: "",
      licensePlate: "",
      capacity: "",
      pricePerKm: "",
      location: "",
      driverPhone: "",
    });
    setShowForm(false);
    setEditingCab(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cabData = {
      ...formData,
      capacity: parseInt(formData.capacity),
      pricePerKm: parseFloat(formData.pricePerKm),
    };

    try {
      if (editingCab) {
        await updateCab({
          variables: { id: editingCab.id, input: cabData },
        });
      } else {
        await addCab({
          variables: { input: cabData },
        });
      }
    } catch (error) {
      console.error("Error saving cab:", error);
    }
  };

  const handleEdit = (cab) => {
    setFormData({
      driverName: cab.driverName,
      carModel: cab.carModel,
      licensePlate: cab.licensePlate,
      capacity: cab.capacity.toString(),
      pricePerKm: cab.pricePerKm.toString(),
      location: cab.location,
      driverPhone: cab.driverPhone,
    });
    setEditingCab(cab);
    setShowForm(true);
  };

  const handleDelete = async (cabId) => {
    if (window.confirm("Are you sure you want to delete this cab?")) {
      try {
        await deleteCab({ variables: { id: cabId } });
      } catch (error) {
        console.error("Error deleting cab:", error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading cabs...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );

  const cabs = data?.getCabs || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cab Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Cab</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCab ? "Edit Cab" : "Add New Cab"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Name
              </label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Model
              </label>
              <input
                type="text"
                name="carModel"
                value={formData.carModel}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Plate
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per KM ($)
              </label>
              <input
                type="number"
                name="pricePerKm"
                value={formData.pricePerKm}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Phone
              </label>
              <input
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                disabled={addLoading || updateLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addLoading || updateLoading
                  ? "Saving..."
                  : editingCab
                  ? "Update Cab"
                  : "Add Cab"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cabs List */}
      <div className="space-y-4">
        {cabs.length > 0 ? (
          cabs.map((cab) => (
            <div key={cab.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cab.carModel}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <span>License: {cab.licensePlate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {cab.capacity} passengers</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Driver Info</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Driver: {cab.driverName}</div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{cab.driverPhone}</span>
                      </div>
                      <div>Location: {cab.location}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Pricing & Status
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>${cab.pricePerKm}/km</span>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cab.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cab.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(cab)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cab.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Car className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Cabs Found
            </h3>
            <p className="text-gray-600">No cabs have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CabManagement;
