const tokenGenerator = () => {
    let val = ''
    for (let i = 0; i < 5; i += 1) {
      val += `${Math.round(Math.random() * 10)}`
    }
    return val
}

export default tokenGenerator;