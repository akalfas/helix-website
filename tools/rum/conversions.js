// eslint-disable-next-line max-classes-per-file
class Criteria {
  constructor(attribute, value) {
    this.attribute = attribute;
    this.value = value;
  }

  matches(event) {
    return event[this.attribute] === this.value;
  }
}

// eslint-disable-next-line import/prefer-default-export
export class MultiAttributeBasedConversion {
  criteria = [];

  constructor(bundle, pairs) {
    this.bundle = bundle;
    pairs.forEach((pair) => {
      Object.entries(pair).forEach(([key, value]) => {
        if (value) { this.criteria.push(new Criteria(key, value)); }
      });
    });
  }

  hasConversion() {
    // eslint-disable-next-line max-len
    return this.bundle.events.some((event) => this.criteria.every((criteria) => criteria.matches(event)));
  }
}
