const MerchantList = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Merchant Directory</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Merchants</h2>
        <p className="text-gray-500">
          The merchant directory list will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default MerchantList;
