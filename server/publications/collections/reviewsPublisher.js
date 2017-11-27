import { check } from "meteor/check";

const reviewsPublisher = (id, collectionType) => {
  check(id, String);
  if (!id) {
    return this.ready();
  }
  return collectionType.find({ revieweeId: id  });
};

export default reviewsPublisher;
