type NumberSet = number[];
type Orders = NumberSet[];

function orderSet(set: NumberSet): Orders;
function orderSet(set: Orders): Orders[];
function orderSet<T extends NumberSet | Orders[]>(set: T): Orders | Orders[] {
  const orders: T[] = [[]] as unknown as T[];

  for (let i = 0; i < set.length; i++) {
    const ordersLength = orders.length;
    for (let j = 0; j < ordersLength; j++) {
      const currentOrder = orders[j];
      const mergedOrder = [...currentOrder, set[i]];
      orders.push(mergedOrder as unknown as T);
    }
  }

  return orders as unknown as Orders | Orders[];
}

function isClosedUnderUnion(sets: Orders): boolean {
  const setsAsStrings = sets.map((set) => set.join(','));

  function orderExists(union: Set<number>): boolean {
    const unionString = Array.from(union).sort().join(',');
    return setsAsStrings.includes(unionString);
  }

  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const union = new Set([...sets[i], ...sets[j]]);

      if (!orderExists(union)) {
        return false;
      }
    }
  }

  return true;
}

function isClosedUnderIntersection(sets: Orders): boolean {
  const setsAsStrings = new Set<string>(sets.map((set) => set.join(',')));

  function orderExists(intersection: number[]): boolean {
    const key = intersection.join(',');
    return setsAsStrings.has(key);
  }

  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const intersection = sets[i].filter((element) => sets[j].includes(element));

      if (!orderExists(intersection)) {
        return false;
      }
    }
  }

  return true;
}

function isOrders(sets: Orders, set: NumberSet): boolean {
  const containsEmptySet = sets.some((s) => s.length === 0);
  const containsSet = sets.some((s) => s.join(',') === set.join(','));

  return (
    containsEmptySet &&
    containsSet &&
    isClosedUnderUnion(sets) &&
    isClosedUnderIntersection(sets)
  );
}

export function generateOrders(set: NumberSet): Orders[] {
  const pSet = orderSet(set);

  const possibleTopologies = orderSet(pSet);

  return  possibleTopologies.filter((t) => isOrders(t, set));
}

const A0: NumberSet = [];
const A1: NumberSet = [1];
const A2: NumberSet = [1, 2];
const A3: NumberSet = [1, 2, 3];
const A4: NumberSet = [1, 2, 3, 4];

const result = [A0, A1, A2, A3, A4].map((A) => generateOrders(A).length);

console.log('result', result);