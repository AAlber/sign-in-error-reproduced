function mockFunction(..._) {
  // console.log("firebase storage function called", _);
}

export const ref = jest.fn(mockFunction);
export const uploadBytes = jest.fn(mockFunction);
export const getDownloadURL = jest.fn(mockFunction);
export const getBlob = jest.fn(mockFunction);
export const getBytes = jest.fn(mockFunction);
export const getStorage = jest.fn(mockFunction);
export const list = jest.fn(mockFunction);
export const listAll = jest.fn(mockFunction);
