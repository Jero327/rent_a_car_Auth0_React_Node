import { useAuth0 } from '@auth0/auth0-react'
import { getAllLocations } from '../client_api/locations'
import { useQuery } from '@tanstack/react-query'
import { location } from '../../type/locations'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Booking() {
  const today = new Date().toISOString().split('T')[0]
  const [pickDate, setPickDate] = useState(today)
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()
  async function retriveLocations() {
    const accessToken = await getAccessTokenSilently()
    return await getAllLocations(accessToken)
  }

  const {
    data: locationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: retriveLocations,
  })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Something wrong!</div>

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const pick_up = formData.get('pick_up')
    const pick_up_time = formData.get('pick_up_time')
    const drop = formData.get('return')
    const drop_time = formData.get('return_time')

    navigate(
      `/search?pick_up=${pick_up}&pick_up_time=${pick_up_time}&drop=${drop}&drop_time=${drop_time}`
    )
  }

  return (
    <>
      <h2>This is Booking page.</h2>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Pick up:
          <select name="pick_up">
            <option selected disabled hidden>
              Select a Location
            </option>
            {locationsData?.map((l: location) => (
              <option key={l.id} value={`${l.id}-${l.name}`}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pick up Time:
          <input
            name="pick_up_time"
            type="date"
            min={today}
            required
            onChange={(e) => setPickDate(e.currentTarget.value)}
          ></input>
        </label>
        <label>
          Return:
          <select name="return">
            <option selected disabled hidden>
              Select a Location
            </option>
            {locationsData?.map((l: location) => (
              <option key={l.id} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Return Time:
          <input name="return_time" type="date" min={pickDate} required></input>
        </label>
        <input type="submit" value="Find my car"></input>
      </form>
    </>
  )
}

export default Booking
