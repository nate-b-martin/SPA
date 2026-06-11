'use client'
import { useState } from "react"
import {Button} from '@/components/ui/button'
import {MinusIcon, PlusIcon} from '@radix-ui/react-icons'

export default function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)

  return (
    <div className='flex items-center gap-3'>
        <Button
        size='icon'
        aria-label="Decrease count"
        onClick={decrement}
        >
            <MinusIcon/>
        </Button>
          <span>Current vote: {count}</span>
        <Button
        size='icon'
        aria-label="Increase count"
        onClick={increment}
        >
            <PlusIcon/>
        </Button>
    </div>
  )
}

