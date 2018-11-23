import React from 'react';
import addons, { makeDecorator } from '@storybook/addons';

const withCode = makeDecorator({
  name: 'withCode',
  parameterName: 'code',
  // This means don't run this decorator if the notes decorator is not set
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, {parameters, options}) => {
    const channel = addons.getChannel();

    const storyOptions = parameters || options;

    // Our simple API above simply sets the notes parameter to a string,
    // which we send to the channel
    channel.emit(`soft/code/add_${storyOptions.label}`, storyOptions);

    return getStory(context);
  }
})

export default withCode;