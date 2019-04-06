import React from 'react'
import { render, mount } from 'enzyme'
import emotionSerializer from 'jest-emotion'

import ImageLoader from '../ImageLoader'
import withAppRoot from '~/components/library/withAppRoot'
import imgSrc from '~/__tests__/__fixtures__/imgSrc'


const testProps = {
  maxWidth: 200,
  maxHeight: 100,
  imgSrc: imgSrc,
  styles: {
    root: {
      color: 'green'
    },
    img: {
      color: 'yellow'
    }
  },
}


describe('ImageLoader', () => {
  describe('required props', () => {
    it('maxWidth', () => {
      const props = {...testProps}
      delete props['maxWidth']
      const RootedImageLoader = withAppRoot(ImageLoader, props)
      expect(() => render(<RootedImageLoader />)).toThrow()
    })
    
    it('maxHeight', () => {
      const props = {...testProps}
      delete props['maxHeight']
      const RootedImageLoader = withAppRoot(ImageLoader, props)
      expect(() => render(<RootedImageLoader />)).toThrow()
    })
    
    it('imgSrc', () => {
      const props = {...testProps}
      delete props['imgSrc']
      const RootedImageLoader = withAppRoot(ImageLoader, props)
      expect(() => render(<RootedImageLoader />)).toThrow()
    })
  })

  describe('snapshots', () => {
    beforeAll(() => {
      expect.addSnapshotSerializer(emotionSerializer)
    })

    it('matches snapshot with all props', () => {
      const RootedImageLoader = withAppRoot(ImageLoader, testProps)
      const wrapper = render(<RootedImageLoader />)
      expect(wrapper).toMatchSnapshot()
    })
  
    it('matches snapshot with no styles', () => {
      const props = {...testProps}
      delete props['styles']
      const RootedImageLoader = withAppRoot(ImageLoader, props)
      const wrapper = render(<RootedImageLoader />)
      expect(wrapper).toMatchSnapshot()
    })

    it('should trigger onload event when image src is loaded', () => {
      const oldHandle = ImageLoader.prototype.handleOnLoad
      const mockHandleOnLoad = jest.fn()
      ImageLoader.prototype.handleOnLoad = mockHandleOnLoad
  
      const RootedImageLoader = withAppRoot(ImageLoader, testProps)
      const wrapper = mount(<RootedImageLoader />)
      wrapper.find('img').simulate('load')
      expect(mockHandleOnLoad).toBeCalledTimes(1)
      
      ImageLoader.prototype.handleOnLoad = oldHandle
      wrapper.unmount()
    })
    
    it('matches snapshot after image src is loaded', () => {
      const RootedImageLoader = withAppRoot(ImageLoader, testProps)
      const wrapper = mount(<RootedImageLoader />)
      wrapper.find('img').simulate('load')
      expect(wrapper).toMatchSnapshot()
      wrapper.unmount()
    })
  })
})