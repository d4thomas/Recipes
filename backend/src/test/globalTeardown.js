// Stop MongoDB instance after test
export default async function globalTeardown() {
  await global.__MONGOINSTANCE.stop()
}
