import React, {useEffect, useRef, useState} from 'react';
import "./Select.scss"

interface ISingleSelectProps {
  multiple?: false,
  selected?: { name: string, _id: number }
  onChange: (item: { name: string, _id: number } | undefined) => void
}

interface IMultiSelectProps {
  multiple: true
  selected: { name: string, _id: number }[]
  onChange: (items: { name: string, _id: number }[]) => void
}

type ISelect = {
  options: any[],
} & (ISingleSelectProps | IMultiSelectProps)



const Select: React.FC<ISelect> = ({
  multiple,
  options,
  selected,
  onChange
}) => {
  const [opened, setOpened] = useState<boolean>(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const open = () => {
    setOpened(prevState => !prevState)
  }

  const clear = (e: any) => {
    e.stopPropagation()
    multiple
      ? onChange([])
      : onChange(undefined)
  }

  const setValue = (option: { name: string, _id: number }) => {
    multiple
      ? selected.includes(option)
        ? onChange(selected.filter((o) => o !== option ))
        : onChange([...selected, option])
      : onChange(option)
  }

  const isOptionSelected = (option: { name: string, _id: number }) => {
    return multiple ? selected.includes(option) : selected?._id === option._id
  }

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node))
        setOpened(false)
    }
    document.addEventListener('click', listener)
    return () => document.removeEventListener('click', listener)
  }, [])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [opened])

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      if (e.target !== wrapRef.current) return
      switch (e.code) {
        case "Enter":
          if (!opened){
            setOpened(prevState => !prevState)
            break
          }
          setValue(options[highlightedIndex])
          setOpened(prevState => !prevState)
          break
        case "Space":
          setOpened(prevState => !prevState)
          break
        case "ArrowUp":
          if (highlightedIndex === 0)
            break
          setHighlightedIndex(prevState => prevState - 1)
          break
        case "ArrowDown":
          if (highlightedIndex === options.length - 1)
            break
          setHighlightedIndex(prevState => prevState + 1)
          break
        case "Escape":
        case "Tab":
          if (opened) {
            setOpened(prevState => !prevState)
          }
          break
      }
    }

    wrapRef.current?.addEventListener('keydown', keyPressHandler)
    return () => wrapRef.current?.removeEventListener('keydown', keyPressHandler)
  }, [opened, highlightedIndex])


  return (
    <div className="select_wrap"
         onClick={open}
         tabIndex={0}
         ref={wrapRef}
    >
      { multiple ?
        <div className="selected_items">
          { selected?.map((option) => (
            <div key={ option._id } className="selected_item">
              <div className="test">{ option.name }</div>
              <div className="clear_btn" onClick={() => setValue(option)}>&times;</div>
            </div>
          )) }
        </div> :
        <div className="selected_item__single">
          { selected?.name }
        </div>
      }
      <div className="select_utils">
        <button className="clear_btn" onClick={clear}>&times;</button>
        <hr className="line" />
        <div className="caret" />
      </div>
      { opened &&
      <div className="select_list__wrap" ref={listRef}>
        <ul className="select_list">
          { options.map((option, index) => (
            <li key={option._id}
                onClick={() => setValue(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={
                  `list_item 
                  ${isOptionSelected(option) && 'list_item__selected'} 
                  ${highlightedIndex === index && 'list_item__highlighted'}`
                }
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
      }
    </div>
  );
};

export default Select;