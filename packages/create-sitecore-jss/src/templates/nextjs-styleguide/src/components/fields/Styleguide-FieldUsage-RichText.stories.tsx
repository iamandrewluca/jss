import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StyleguideFieldUsageRichText, {
  StyleguideFieldUsageRichTextProps as Props,
} from './Styleguide-FieldUsage-RichText';
import { StorybookArgs, withFields, withSitecoreContext } from 'storybook-utils/utils';

export default {
  title: 'Components/fields/Styleguide-FieldUsage-RichText',
  component: StyleguideFieldUsageRichText,
} as ComponentMeta<typeof StyleguideFieldUsageRichText>;

type Args = StorybookArgs<Props>;

const Template: ComponentStory<typeof StyleguideFieldUsageRichText> = (args) => (
  <StyleguideFieldUsageRichText {...args} />
);

export const Default = Template.bind({});
Default.args = withFields<Args, Props>({
  params: {
    name: 'Styleguide-FieldUsage-RichText',
  },
  rendering: {
    uid: '{00000000-0000-0000-0000-000000000000}',
    componentName: 'Styleguide-FieldUsage-RichText',
    dataSource: '{00000000-0000-0000-0000-000000000000}',
  },
  fields: {
    heading: 'Rich Text',
    description: 'Description',
    sample:
      '<p>This is a sample rich text field. <mark>HTML is always supported.</mark> In Sitecore, editors will see a WYSIWYG editor for these fields.</p>',
    sample2: `<p>Another sample rich text field, using options. Keep markup entered in rich text fields as simple as possible - ideally bare tags only (no classes). Adding a wrapping class can help with styling within rich text blocks.</p>
        <marquee>But you can use any valid HTML in a rich text field!</marquee>`,
  },
});
Default.decorators = [withSitecoreContext()];