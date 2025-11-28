const DeleteConfirmationPage = () => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Are you sure you want to delete this customer history?
          </h2>
          <p className="text-gray-600 mb-6">
            This action is{" "}
            <span className="font-semibold text-red-600">irreversible</span>.
            Once deleted, all records related to this customer will be
            permanently removed.
          </p>

          <div className="flex justify-end space-x-4">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all">
              Cancel
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationPage;
