const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || "";
    const count = +counter.innerText.replace(/,/g, ''); // Remove commas to do math

    // Lower speed = slower animation
    const speed = 200; 
    const inc = target / speed;

    if (count < target) {
      // Use Math.ceil to ensure it reaches the target
      const nextCount = Math.ceil(count + inc);
      // Format with commas and add suffix
      counter.innerText = nextCount.toLocaleString() + suffix;
      setTimeout(updateCount, 1);
    } else {
      counter.innerText = target.toLocaleString() + suffix;
    }
  };

  updateCount();
});
