+++
date = "2018-07-08 19:50:00 +0000"
description = "Python 3.7 Data Classes"
linktitle = ""
title = "Python 3.7 Data Classes"
slug = "Python 3.7 Data Classes"
type = "post"
+++

[PEP 557](https://www.python.org/dev/peps/pep-0557/) in the recently-released [Python 3.7]() added data classes to the standard Python library. Data classes can be thought of as mutable data holders and are somewhat similar to [named tuples](https://docs.python.org/2/library/collections.html#collections.namedtuple), although named tuples are immutable.

Data classes provide a lot of boilerplate code, saving time and effort on the part of the Python programmer, although it could be argued that this layer of abstraction makes debugging more difficult.

## Comparing regular classes and data classes

Consider the following class:

```python
class BankAccount():
	def __init__(self, id, balance, customer_id):
		self.id = id
		self.balance = balance
		self.customer_id = customer_id
```

This provides us with the minimal ability to initialise a new BankAccount object, although we've had to reference `id`, `balance`, and `customer_id` three times in this small piece of code.

Let's initialise two new objects using our `BankAccount` class - `my_account` and `your_account`. We'll initialise both with the same values, ignoring the fact that they should have different `id` and `customer_id` values, then try and compare them to each other.

```python
>>> my_account = BankAccount(1, 0, 1)
>>> your_account = BankAccount(1, 0, 1)
>>> my_account == your_account
False
```

In order to be able to compare our `my_account` and `your_account` objects successfully, we'd need to add an `__eq__` method to our class.

```python
class BankAccount():
	def __init__(self, id, balance, customer_id):
		self.id = id
		self.balance = balance
		self.customer_id = customer_id

	def __eq__(self, other):
		if self.__class__ is other.__class__:
			return (self.id, self.balance, self.customer_id) == (other.id, other.balance, other.customer_id)
		return NotImplemented
```

If we initialise our two objects again and compare them now, we'll get the `True` response that we're expecting. If we were to initialise the `your_account` object with an `id` value of `2`, and a `customer_id` value of `2`, we'd get the correct response of `False` when comparing the two objects.

```python
>>> my_account = BankAccount(1, 0, 1)
>>> your_account = BankAccount(1, 0, 1)
>>> my_account == your_account
True
>>> your_account = BankAccount(2, 0, 2)
>>> my_account == your_account
False
```

This all makes sense so far, but it's boilerplate code that we have to write each and every time that we write a new class. Let's take a look at how we'd do the same thing with 3.7's data classes.

```python
from dataclasses import dataclass

@dataclass
class DataClassBankAccount():
	id: int
	balance: int
	customer_id: int
```

Data classes generate all of this boilerplate code for us, but they don't stop at just the `__init__` and `__eq__` methods - they can also generate `__repr__`, `__ne__`, `__lt__`, `__le__`, `__gt__`, and `__ge__` methods too, if the `order` parameter is specified as `True` (this is done at the `@dataclass` level, i.e. `@dataclass(order=True)`). Additional methods can be added to the data class as you would for a normal class. The `@dataclass` decorator inspects a class definition for fields with type annotations (added in [PEP 526](https://www.python.org/dev/peps/pep-0526/)). These type annotations are _mandatory_ when creating data classes as fields without type annotations will simply be ignored. We can now initialise and compare our two objects straight away:

```python
>>> my_account = DataClassBankAccount(1, 0, 1)
>>> your_account = DataClassBankAccount(1, 0, 1)
>>> my_account == your_account
True
>>> your_account = DataClassBankAccount(2, 0, 2)
>>> my_account == your_account
False
```

As mentioned in [PEP 557](https://www.python.org/dev/peps/pep-0557/), there isn't anything special about these classes. The decorator takes the class and adds generated methods to it, then returns the class it was given. This means adding your own methods to a data class is done in exactly the same way as you would for a regular class.

## Comparing named tuples and data classes

Let's compare for a moment our bank account data class and an implementation of the bank account using a named tuple.

```python
from typing import NamedTuple

class NamedTupleBankAccount(NamedTuple):
	id: int
	balance: int
	customer_id: int
```

There's no great difference here, other than the fact that our data class was described using a decorator, whilst the named tuple subclasses `NamedTuple`. There are other similarities too. For instance, with our data class we can create a new object from an existing data class object.

```python
>>> from dataclasses import replace
>>>
>>> replace(my_account, balance=100)
BankAccount(id=1, balance=100, customer_id=1)
```

We'd do this in a similar way with a named tuple, but the replace method here is proceded by an underscore, indicating that it is a private method of our named tuple bank account object.

```python
>>> our_account = NamedTupleBankAccount(3, 0, 3)
>>>
>>> our_account._replace(balance=100)
NamedTupleBankAccount(id=3, balance=100, customer_id=3)
```

Data classes also provide methods for conversion to dictionaries and tuples.

```python
>>> from dataclasses import asdict, astuple
>>>
>>> asdict(my_account)
{'id': 1, 'balance': 0, 'customer_id': 1}
>>>
>>> astuple(my_account)
(1, 0, 1)
```

And similarly, the `asdict` method exists as a private method of our named tuple object, with the key difference being that this returns an `OrderedDict` rather than a standard dict.

```python
>>> our_account._asdict()
OrderedDict([('id', 3), ('balance', 0), ('customer_id', 3)])
```

You can unpack a named tuple rather simply, but must first wrap a data class object in a call to `astuple` before it is possible to unpack - this is because data classes don't iterate by default.

```python
>>> our_account_id, our_balance, our_customer_id = our_account
>>> our_account_id
3
>>>
>>> my_account_id, my_balance, my_customer_id = astuple(my_account)
>>> my_account_id
1
```

Data classes can't be hashed by default, whereas named tuples can - data classes actually set `__hash__` to `None` in order to avoid accidental hashability. Named tuples provide hashability and ordering out of the box, as they are inherited from tuples.

Equality methods between the two types are different as well. It's possible to compare two different named tuple objects instantiated from two different named tuple classes which happen to have the same field naming - this is because named tuples lack the `if self.__class__ is other.__class__:` conditional that data classes provide in their equality methods.

As of Python 3.7 it is slower to access fields of a named tuple than those of a data class, though [Raymond Hettinger](https://twitter.com/raymondh) mentions in his PyCon 2018 talk '[Dataclasses: The code generator to end all code generators](https://www.youtube.com/watch?v=T-TwcmT6Rcw)' that this timing will be improved significantly in Python 3.8. You can find the slides for Raymond's PyCon talk [here](https://twitter.com/raymondh/status/995693882812915712).

You shouldn't think of data classes as an improvement upon a named tuple - if that's what fits the structure of your data, then that's what you should use.

## Additional data class usages

### Default values

We can set default values for our specified data class fields. Let's take a look at how we'd do that with a normal class.

```python
class Animal:
	def __init__(self, type, legs=4):
		self.type = type
		self.legs = legs
```

When declaring our data class, we declare our default value(s) differently.

```python
@dataclass
class Animal:
	type: str
	legs: int = 4
```

The above data class will give the below output when initialising objects.

```python
>>> Animal("dog")
Animal(type="dog", legs=4)
>>> Animal("ostrich", 2)
Animal(type="ostrich", legs=2)
```

Building upon our original BankAccount class we can take a look at a more advanced default value. Let's say for each bank account object, we want to track who accessed the bank account and when. We'll create a more advanced BankAccount class that features this functionality.

```python
from dataclass import field
from datetime import datetime

@dataclass
class AdvancedBankAccount():
	id: int
	balance: int = field(metadata={"currency": "GBP"})
	customer_id: int
	accessed_by: list = field(default_factory=list)

	def access(self, accessor_id):
		self.accessed_by.append((accessor_id, datetime.now()))
```

```python
>>> advanced_account = AdvancedBankAccount(4, 10000, 4)
>>> advanced_account.access(1)
>>> advanced_account
AdvancedBankAccount(id=4, balance=10000, customer_id=4, accessed_by=[(1, datetime.datetime(2018, 7, 8, 19, 30, 40, 783467))])
```

The `default_factory` is used to provide a mutable default value. Additionally, we've also passed a metadata parameter which specifies some metadata about the field, in this case the currency of the `balance`. The dataclass itself won't do anything with this, but you can view it using the `fields` function.

### Field arguments

We can pass some additional arguments when creating our data classes.

We can not include a specific field in the output of the class `__repr__` method.

```python
from dataclasses import field

@dataclass
class Animal():
	type: str = field(repr=False)
	legs: int = 4
```

And we could also not include a specific field when comparing two objects from the same data class.

```python
from dataclasses import field

@dataclass
class Animal():
	type: str = field(order=False)
	legs: int = 4
```

### Immutable data classes

Data classes are mutable by default, but there might be scenarios where we want to maintain the immutability that a named tuple offers us.

```python
from dataclasses import field

@dataclass(frozen=True)
class Animal():
	type: str
	legs: int
```

The `frozen=True` argument that we've passed to the `@dataclass` decorator means that we won't be able to assign values to any objects created from this data class after their initialisation.

```python
>>> cat = Animal("cat", 4)
>>> cat.legs = 3
dataclasses.FrozenInstanceError: cannot assign to field 'legs'
```

## Further reading

- [PEP557](https://www.python.org/dev/peps/pep-0557/)
- [Dataclasses: The code generator to end all code generators](https://www.youtube.com/watch?v=T-TwcmT6Rcw)
