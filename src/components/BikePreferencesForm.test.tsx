import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BikePreferencesForm } from './BikePreferencesForm';
import { DEFAULT_BIKE_PREFERENCES } from '../types/biking.types';

describe('BikePreferencesForm', () => {
  it('renders all form fields with labels', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    // Check for all field labels
    expect(screen.getByLabelText(/Min Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Wind Speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max UV Index/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Air Quality Index/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I'll bike in rain\/snow/i)).toBeInTheDocument();
  });

  it('displays default values correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    // Check default values match
    expect(screen.getByLabelText(/Min Temperature/i)).toHaveValue(45);
    expect(screen.getByLabelText(/Max Temperature/i)).toHaveValue(85);
    expect(screen.getByLabelText(/Max Wind Speed/i)).toHaveValue(20);
    expect(screen.getByLabelText(/Max UV Index/i)).toHaveValue(8);
    expect(screen.getByLabelText(/Max Air Quality Index/i)).toHaveValue(100);
    expect(screen.getByLabelText(/I'll bike in rain\/snow/i)).not.toBeChecked();
  });

  it('calls onChange when temperature fields are updated', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    const minTempInput = screen.getByLabelText(/Min Temperature/i);
    
    // Directly trigger change event with new value
    fireEvent.change(minTempInput, { target: { value: '60' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...DEFAULT_BIKE_PREFERENCES,
      minTemp: 60,
    });
  });

  it('calls onChange when wind speed is updated', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    const windSpeedInput = screen.getByLabelText(/Max Wind Speed/i);
    
    // Directly trigger change event with new value
    fireEvent.change(windSpeedInput, { target: { value: '15' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...DEFAULT_BIKE_PREFERENCES,
      maxWindSpeed: 15,
    });
  });

  it('calls onChange when UV index is updated', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    const uvIndexInput = screen.getByLabelText(/Max UV Index/i);
    
    // Directly trigger change event with new value
    fireEvent.change(uvIndexInput, { target: { value: '10' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...DEFAULT_BIKE_PREFERENCES,
      maxUvIndex: 10,
    });
  });

  it('calls onChange when AQI is updated', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    const aqiInput = screen.getByLabelText(/Max Air Quality Index/i);
    
    // Directly trigger change event with new value
    fireEvent.change(aqiInput, { target: { value: '150' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...DEFAULT_BIKE_PREFERENCES,
      maxAqi: 150,
    });
  });

  it('calls onChange when precipitation checkbox is toggled', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    const precipCheckbox = screen.getByLabelText(/I'll bike in rain\/snow/i);
    
    await user.click(precipCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...DEFAULT_BIKE_PREFERENCES,
      okWithPrecipitation: true,
    });
  });

  it('resets to defaults when reset button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    const customPreferences = {
      minTemp: 60,
      maxTemp: 90,
      maxWindSpeed: 15,
      okWithPrecipitation: true,
      maxUvIndex: 10,
      maxAqi: 150,
    };

    render(
      <BikePreferencesForm 
        preferences={customPreferences} 
        onChange={mockOnChange} 
      />
    );

    const resetButton = screen.getByRole('button', { name: /Reset to Defaults/i });
    await user.click(resetButton);

    expect(mockOnChange).toHaveBeenCalledWith(DEFAULT_BIKE_PREFERENCES);
  });

  it('displays field hints for user guidance', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    // Check for helpful hints
    expect(screen.getByText(/Coldest you'll ride in/i)).toBeInTheDocument();
    expect(screen.getByText(/Hottest you'll ride in/i)).toBeInTheDocument();
    expect(screen.getByText(/Windiest you'll ride in/i)).toBeInTheDocument();
    expect(screen.getByText(/0-11\+/i)).toBeInTheDocument(); // UV index hint
    expect(screen.getByText(/0-500/i)).toBeInTheDocument(); // AQI hint
  });

  it('renders with custom preferences', () => {
    const mockOnChange = vi.fn();
    const customPreferences = {
      minTemp: 35,
      maxTemp: 95,
      maxWindSpeed: 25,
      okWithPrecipitation: true,
      maxUvIndex: 12,
      maxAqi: 200,
    };

    render(
      <BikePreferencesForm 
        preferences={customPreferences} 
        onChange={mockOnChange} 
      />
    );

    expect(screen.getByLabelText(/Min Temperature/i)).toHaveValue(35);
    expect(screen.getByLabelText(/Max Temperature/i)).toHaveValue(95);
    expect(screen.getByLabelText(/Max Wind Speed/i)).toHaveValue(25);
    expect(screen.getByLabelText(/Max UV Index/i)).toHaveValue(12);
    expect(screen.getByLabelText(/Max Air Quality Index/i)).toHaveValue(200);
    expect(screen.getByLabelText(/I'll bike in rain\/snow/i)).toBeChecked();
  });

  it('has proper input constraints', () => {
    const mockOnChange = vi.fn();
    render(
      <BikePreferencesForm 
        preferences={DEFAULT_BIKE_PREFERENCES} 
        onChange={mockOnChange} 
      />
    );

    // Check min/max attributes
    const minTempInput = screen.getByLabelText(/Min Temperature/i);
    expect(minTempInput).toHaveAttribute('min', '-20');
    expect(minTempInput).toHaveAttribute('max', '120');

    const windSpeedInput = screen.getByLabelText(/Max Wind Speed/i);
    expect(windSpeedInput).toHaveAttribute('min', '0');
    expect(windSpeedInput).toHaveAttribute('max', '100');

    const uvIndexInput = screen.getByLabelText(/Max UV Index/i);
    expect(uvIndexInput).toHaveAttribute('min', '0');
    expect(uvIndexInput).toHaveAttribute('max', '15');

    const aqiInput = screen.getByLabelText(/Max Air Quality Index/i);
    expect(aqiInput).toHaveAttribute('min', '0');
    expect(aqiInput).toHaveAttribute('max', '500');
  });
});
